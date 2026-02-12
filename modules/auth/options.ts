import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { getMongoClientPromise } from "@/lib/db/mongodb-client";
import { getServerEnv } from "@/lib/env/server";

function ensureDevAuthEnv(env: ReturnType<typeof getServerEnv>) {
  if (env.NODE_ENV === "production") {
    return;
  }

  if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = "http://localhost:3000";
  }

  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = "dev-only-nextauth-secret-change-in-production";
  }
}

function buildProviders(env: ReturnType<typeof getServerEnv>): NonNullable<NextAuthOptions["providers"]> {
  const providers: NonNullable<NextAuthOptions["providers"]> = [];

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
    );
  }

  if (env.EMAIL_SERVER && env.EMAIL_FROM) {
    providers.push(
      EmailProvider({
        server: env.EMAIL_SERVER,
        from: env.EMAIL_FROM,
      }),
    );
  }

  if (providers.length === 0) {
    providers.push(
      CredentialsProvider({
        name: "Development Fallback",
        credentials: {
          email: { label: "Email", type: "email" },
          name: { label: "Name", type: "text" },
        },
        async authorize(credentials) {
          const email =
            typeof credentials?.email === "string"
              ? credentials.email.trim().toLowerCase()
              : "";

          if (!email) {
            return null;
          }

          const name =
            typeof credentials?.name === "string" && credentials.name.trim()
              ? credentials.name.trim()
              : "Traveler";

          return {
            id: `dev-${email}`,
            email,
            name,
          };
        },
      }),
    );
  }

  return providers;
}

export function getAuthOptions(): NextAuthOptions {
  const env = getServerEnv();
  ensureDevAuthEnv(env);
  const providers = buildProviders(env);
  const usesCredentialsFallback =
    providers.length === 1 && providers[0]?.id === "credentials";
  const hasMongo = Boolean(env.MONGODB_URI);
  const enableDatabaseAuth = hasMongo && !usesCredentialsFallback;

  return {
    ...(enableDatabaseAuth ? { adapter: MongoDBAdapter(getMongoClientPromise()) } : {}),
    providers,
    secret: process.env.NEXTAUTH_SECRET ?? env.NEXTAUTH_SECRET,
    session: {
      strategy: enableDatabaseAuth ? "database" : "jwt",
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/signin",
      verifyRequest: "/auth/signin",
      newUser: "/dashboard",
    },
    callbacks: {
      async session({ session, user, token }) {
        if (session.user) {
          session.user.id = user?.id ?? (token.sub ?? "");
        }
        return session;
      },
    },
  };
}
