import NextAuth from "next-auth"
import LineProvider from "next-auth/providers/line"
import { SupabaseAdapter } from "@auth/supabase-adapter"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "profile openid", // 如果您的 LINE Channel 有申請 Email，可以加上 email
          bot_prompt: "normal" // 這會提示使用者加入官方帳號為好友
        },
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  }),
  // 使用 JWT 策略，這樣我們可以很方便地把 LINE User ID 夾在 Cookie 裡
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, account }) {
      // 第一次登入時，把 LINE 的 User ID 存入 token
      if (account) {
        token.lineUserId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // 讓外部可以從 session.user.lineUserId 拿到 LINE User ID
      if (session.user && token.lineUserId) {
        (session.user as any).lineUserId = token.lineUserId;
      }
      return session;
    }
  }
})
