import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null;
        const { username, password } = credentials;
        const res = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/login",
          {
            method: "POST",
            body: JSON.stringify({
              username,
              password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status == 401) {
          console.log(res.statusText);

          return null;
        }
        const user = await res.json();
        return user;
      },
    }),
  ],
});
