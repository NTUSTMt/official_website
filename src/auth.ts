import NextAuth from "next-auth"
import LineProvider from "next-auth/providers/line"
import { createClient } from "@supabase/supabase-js"

// 建立一個擁有管理權限的 Supabase 客戶端來寫入資料
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",
  {
    auth: {
      persistSession: false,
    }
  }
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  basePath: "/api/auth",
  debug: process.env.NODE_ENV === "development" || process.env.VERCEL === "1",
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
      checks: ["state"],
      authorization: {
        params: {
          scope: "profile openid email",
          bot_prompt: "normal" 
        },
      },
    }),
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "line") {
        try {
          const lineUserId = account.providerAccountId;
          
          // 1. 優先透過 accounts 表檢查此 LINE ID 是否已經連結過使用者
          const { data: existingAccount } = await supabaseAdmin
            .from("accounts")
            .select("userId")
            .eq("provider", "line")
            .eq("providerAccountId", lineUserId)
            .single();

          let userId = existingAccount?.userId;
          const isVirtualEmail = user.email?.endsWith("@line.me");
          const realEmail = isVirtualEmail ? null : user.email;

          if (!userId) {
            // 2. 如果 LINE ID 沒連結過，檢查是否存在相同 Email 的使用者 (僅限非虛擬信箱)
            if (realEmail) {
              const { data: userWithEmail } = await supabaseAdmin
                .from("users")
                .select("id")
                .eq("email", realEmail)
                .single();
              userId = userWithEmail?.id;
            }

            if (!userId) {
              // 3. 還是找不到，則建立新使用者
              const { data: newUser, error: createError } = await supabaseAdmin
                .from("users")
                .insert({
                  name: user.name,
                  email: realEmail, // 如果是虛擬信箱則存入 null
                  image: user.image,
                })
                .select("id")
                .single();
              
              if (createError) throw createError;
              userId = newUser.id;
            }

            // 4. 建立帳號連結
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

          return true;
        } catch (error) {
          console.error("LINE 登入處理失敗:", error);
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
