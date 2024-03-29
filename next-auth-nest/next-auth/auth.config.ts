import type { NextAuthConfig } from "next-auth";
import { type TokenSet } from "@auth/core/types";
import { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        // client_id: process.env.GOOGLE_CLIENT_ID,
        // client_secret: process.env.GOOGLE_CLIENT_SECRET,
        // grant_type: "refresh_token",
        // refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

async function refreshToken(token: JWT): Promise<JWT> {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/refresh",
    {
      method: "POST",
      headers: {
        authorization: `Refresh ${token.backendTokens.refreshToken}`,
      },
    }
  );
  console.log("refreshed");

  const response = await res.json();

  return {
    ...token,
    backendTokens: response,
  };
}

export const authConfig = {
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.type === "credentials") {
          const myUser = user as any;
          return {
            access_token: myUser.backendTokens.accessToken,
            expires_at: myUser.backendTokens.expiresIn,
            refresh_token: myUser.backendTokens.refreshToken,
            backendTokens: myUser.backendTokens,
            user: myUser.user,
          };
        }
      }
      // console.log(new Date());
      // console.log(token.backendTokens.expiresIn);
      if (new Date().getTime() < token.backendTokens.expiresIn) return token;

      return await refreshToken(token);
      //   if (account) {
      //     // Save the access token and refresh token in the JWT on the initial login
      //     return {
      //       access_token: account.access_token,
      //       expires_at: Math.floor(Date.now() / 1000 + account.expires_in),
      //       refresh_token: account.refresh_token,
      //     };
      //   } else if (Date.now() < token.expires_at * 1000) {
      //     // If the access token has not expired yet, return it
      //     return token;
      //   } else {
      //     // If the access token has expired, try to refresh it
      //     try {
      //       // https://accounts.google.com/.well-known/openid-configuration
      //       // We need the `token_endpoint`.
      //       const response = await fetch("https://oauth2.googleapis.com/token", {
      //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
      //         body: new URLSearchParams({
      //           client_id: process.env.GOOGLE_ID,
      //           client_secret: process.env.GOOGLE_SECRET,
      //           grant_type: "refresh_token",
      //           refresh_token: token.refresh_token,
      //         }),
      //         method: "POST",
      //       });

      //       const tokens: TokenSet = await response.json();

      //       if (!response.ok) throw tokens;

      //       return {
      //         ...token, // Keep the previous token properties
      //         access_token: tokens.access_token,
      //         expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
      //         // Fall back to old refresh token, but note that
      //         // many providers may only allow using a refresh token once.
      //         refresh_token: tokens.refresh_token ?? token.refresh_token,
      //       };
      //     } catch (error) {
      //       console.error("Error refreshing access token", error);
      //       // The error property will be used client-side to handle the refresh token error
      //       return { ...token, error: "RefreshAccessTokenError" as const };
      //     }
      //   }
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = { ...session.user, ...token.user };
        session.backendTokens = token.backendTokens;
        session.error = token.error;
      }
      //   session.error = token.error;
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

declare module "@auth/core/types" {
  interface Session {
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    error?: "RefreshAccessTokenError";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token: string;
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    error?: "RefreshAccessTokenError";
  }
}
