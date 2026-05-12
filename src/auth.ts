import NextAuth from "next-auth"
import LineProvider from "next-auth/providers/line"
import { createClient } from "@supabase/supabase-js"

// 建立一個擁有管理權限的 Supabase 客戶端來寫入資料
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      persistSession: false,
    }
  }
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "profile openid",
          bot_prompt: "normal" 
        },
      },
    }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "line") {
        try {
          const lineUserId = account.providerAccountId;
          
          // 檢查使用者是否已經存在於我們自己的 public.users 表中
          const { data: existingUser } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("email", user.email || `${lineUserId}@line.me`)
            .single();

          let userId;

          if (!existingUser) {
            // 如果不存在，手動新增一筆使用者資料
            const { data: newUser, error: createError } = await supabaseAdmin
              .from("users")
              .insert({
                name: user.name,
                email: user.email || `${lineUserId}@line.me`,
                image: user.image,
              })
              .select("id")
              .single();
            
            if (createError) throw createError;
            userId = newUser.id;
          } else {
            userId = existingUser.id;
          }

          // 檢查帳號連結 (accounts table)
          const { data: existingAccount } = await supabaseAdmin
            .from("accounts")
            .select("id")
            .eq("provider", "line")
            .eq("providerAccountId", lineUserId)
            .single();

          if (!existingAccount && userId) {
            // 如果還沒綁定 LINE 帳號，幫他綁定
            const { error: linkError } = await supabaseAdmin
              .from("accounts")
              .insert({
                userId: userId,
                type: "oauth",
                provider: "line",
                providerAccountId: lineUserId,
                access_token: account.access_token,
                id_token: account.id_token,
              });
            
            if (linkError) throw linkError;
          }

          return true; // 允許登入
        } catch (error) {
          console.error("手動寫入 Supabase 失敗:", error);
          // 即使資料庫寫入失敗，我們依然允許使用者登入 (看您的需求，這裡先回傳 true 確保畫面不會當機)
          return true;
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.lineUserId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.lineUserId) {
        (session.user as any).lineUserId = token.lineUserId;
      }
      return session;
    }
  }
})
