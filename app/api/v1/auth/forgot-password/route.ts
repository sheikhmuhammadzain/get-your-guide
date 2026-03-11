import { z } from "zod";
import { getMongoClientPromise } from "@/lib/db/mongodb-client";
import { sendPasswordResetEmail } from "@/lib/email/resend";
import { getServerEnv } from "@/lib/env/server";
import { createPasswordResetToken } from "@/modules/auth/password-reset.repository";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const instance = new URL(request.url).pathname;
  const env = getServerEnv();
  const isDev = env.NODE_ENV !== "production";

  try {
    const { email } = schema.parse(await request.json());
    const normalizedEmail = email.trim().toLowerCase();

    console.log(`[forgot-password] request for: ${normalizedEmail}`);

    // ── Look up user ──────────────────────────────────────────────
    const client = await getMongoClientPromise();
    const db = client.db();

    // Check both collections — NextAuth adapter uses "users", manual signup also uses "users"
    const usersCol = db.collection<{ email?: string; name?: string }>("users");
    const user = await usersCol.findOne({ email: normalizedEmail });

    console.log(`[forgot-password] user found: ${Boolean(user)}`);

    if (!user) {
      console.log(
        `[forgot-password] no account for ${normalizedEmail} — skipping email`,
      );

      // In dev, return a clear message so you know what happened
      if (isDev) {
        return ok({
          success: true,
          message:
            "If an account exists for that email, a reset link has been sent.",
          _dev: `No account found for "${normalizedEmail}". Create an account first, then retry.`,
        });
      }

      // In production — always return generic success (prevent email enumeration)
      return ok({
        success: true,
        message:
          "If an account exists for that email, a reset link has been sent.",
      });
    }

    // ── Generate reset token ──────────────────────────────────────
    console.log(
      `[forgot-password] creating reset token for: ${normalizedEmail}`,
    );
    let rawToken: string;
    try {
      rawToken = await createPasswordResetToken(normalizedEmail);
      console.log(
        `[forgot-password] reset token created OK for: ${normalizedEmail}`,
      );
    } catch (tokenErr) {
      const message =
        tokenErr instanceof Error ? tokenErr.message : String(tokenErr);
      console.error(
        `[forgot-password] createPasswordResetToken FAILED:`,
        message,
      );
      if (isDev) {
        return ok({
          success: false,
          message: "Failed to create reset token.",
          _dev: `Token creation error: ${message}. Check MongoDB connection and password_reset_tokens collection.`,
        });
      }
      return ok({
        success: true,
        message:
          "If an account exists for that email, a reset link has been sent.",
      });
    }

    const baseUrl = env.NEXTAUTH_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${rawToken}`;
    console.log(`[forgot-password] reset URL built: ${resetUrl}`);

    // ── Send email ────────────────────────────────────────────────
    try {
      await sendPasswordResetEmail({
        to: normalizedEmail,
        name: user.name ?? undefined,
        resetUrl,
      });
      console.log(
        `[forgot-password] email sent successfully to: ${normalizedEmail}`,
      );
    } catch (emailErr) {
      const message =
        emailErr instanceof Error ? emailErr.message : String(emailErr);
      console.error(
        `[forgot-password] email send FAILED for ${normalizedEmail}:`,
        message,
      );

      // In dev — surface the real error so you can fix it immediately
      if (isDev) {
        return ok({
          success: false,
          message: "Reset token was created but the email failed to send.",
          _dev: `Resend error: ${message}. Check RESEND_API_KEY and RESEND_FROM_EMAIL in .env.local.`,
          _resetUrl: resetUrl, // expose the link directly in dev so you can test the reset page
        });
      }
    }

    return ok({
      success: true,
      message:
        "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
