import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { getMongoClientPromise } from "@/lib/db/mongodb-client";
import { getServerEnv } from "@/lib/env/server";

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
        credentials: {},
        async authorize() {
          return null;
        },
      }),
    );
  }

  return providers;
}

export function getAuthOptions(): NextAuthOptions {
  const env = getServerEnv();
  const providers = buildProviders(env);
  const hasMongo = Boolean(env.MONGODB_URI);

  return {
    ...(hasMongo ? { adapter: MongoDBAdapter(getMongoClientPromise()) } : {}),
    providers,
    secret: env.NEXTAUTH_SECRET,
    session: {
      strategy: hasMongo ? "database" : "jwt",
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
