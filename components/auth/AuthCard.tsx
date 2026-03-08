"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { CheckCircle2, ArrowLeft } from "lucide-react";

interface AuthCardProps {
  mode: "signin" | "signup";
}

type View = "main" | "forgot";

export default function AuthCard({ mode }: AuthCardProps) {
  const [view, setView] = useState<View>("main");

  /* ── Main auth ── */
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Forgot password ── */
  const [fpCurrentPassword, setFpCurrentPassword] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState<string | null>(null);
  const [fpSuccess, setFpSuccess] = useState(false);

  const isSignup = mode === "signup";
  const callbackUrl = useMemo(() => "/dashboard", []);

  /* ── Sign in / Sign up ── */
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const response = await signIn("credentials", {
      email,
      password,
      intent: isSignup ? "signup" : "signin",
      ...(isSignup ? { name } : {}),
      redirect: false,
      callbackUrl,
    });

    if (!response || response.error) {
      setError(
        isSignup
          ? "An account with this email already exists."
          : "Sign in failed. Check your email and password.",
      );
      setIsLoading(false);
      return;
    }

    if (!isSignup) {
      try {
        const adminProbe = await fetch("/api/v1/admin/overview", { method: "GET" });
        if (adminProbe.ok) {
          window.location.href = "/admin";
          return;
        }
      } catch {
        // Ignore and fall through to default dashboard.
      }
    }

    window.location.href = response.url ?? callbackUrl;
  }

  /* ── Forgot password ── */
  function openForgot() {
    setFpCurrentPassword("");
    setFpNewPassword("");
    setFpConfirmPassword("");
    setFpError(null);
    setFpSuccess(false);
    setView("forgot");
  }

  async function onForgotSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFpError(null);

    if (fpNewPassword !== fpConfirmPassword) {
      setFpError("New passwords do not match.");
      return;
    }

    setFpLoading(true);
    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          currentPassword: fpCurrentPassword,
          newPassword: fpNewPassword,
          confirmPassword: fpConfirmPassword,
        }),
      });

      const body = (await res.json()) as { detail?: string };
      if (!res.ok) throw new Error(body.detail ?? "Password change failed");

      setFpSuccess(true);
    } catch (err) {
      setFpError(err instanceof Error ? err.message : "Password change failed");
    } finally {
      setFpLoading(false);
    }
  }

  /* ── Shared card wrapper ── */
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-border-default bg-surface-base p-5 shadow-md md:rounded-2xl md:p-6 md:shadow-lg">

      {/* ══ Forgot password view ══════════════════════ */}
      {view === "forgot" && (
        <>
          <button
            type="button"
            onClick={() => setView("main")}
            className="mb-4 flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </button>

          <h1 className="text-2xl font-bold text-text-heading">Change password</h1>
          <p className="mt-1 text-sm text-text-body">
            Enter your email, current password, and choose a new one.
          </p>

          {fpSuccess ? (
            <div className="mt-6 flex flex-col items-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-text-primary">
                Password changed successfully!
              </p>
              <p className="text-xs text-text-muted">
                You can now sign in with your new password.
              </p>
              <button
                type="button"
                onClick={() => setView("main")}
                className="mt-2 w-full rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={onForgotSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-text-body">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-lg border border-border-strong bg-surface-base px-3 text-text-primary outline-none focus:border-brand"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-text-body">
                  Current password
                </span>
                <input
                  required
                  type="password"
                  value={fpCurrentPassword}
                  onChange={(e) => setFpCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="h-11 w-full rounded-lg border border-border-strong bg-surface-base px-3 text-text-primary outline-none focus:border-brand"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-text-body">
                  New password
                </span>
                <input
                  required
                  type="password"
                  value={fpNewPassword}
                  onChange={(e) => setFpNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="h-11 w-full rounded-lg border border-border-strong bg-surface-base px-3 text-text-primary outline-none focus:border-brand"
                />
                <p className="mt-1 text-xs text-text-muted">
                  Use at least 8 characters with uppercase, lowercase, number, and symbol.
                </p>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-text-body">
                  Confirm new password
                </span>
                <input
                  required
                  type="password"
                  value={fpConfirmPassword}
                  onChange={(e) => setFpConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="h-11 w-full rounded-lg border border-border-strong bg-surface-base px-3 text-text-primary outline-none focus:border-brand"
                />
              </label>

              {fpError && (
                <p className="text-sm text-red-600 dark:text-red-400">{fpError}</p>
              )}

              <button
                type="submit"
                disabled={fpLoading}
                className="w-full rounded-full bg-brand px-5 py-2.5 font-semibold text-white disabled:opacity-70"
              >
                {fpLoading ? "Changing password…" : "Change password"}
              </button>
            </form>
          )}
        </>
      )}

      {/* ══ Main view (sign in / sign up) ══════════════ */}
      {view === "main" && (
        <>
          <h1 className="text-2xl font-bold text-text-heading">
            {isSignup ? "Create account" : "Sign in"}
          </h1>
          <p className="mt-1 text-sm text-text-body">
            {isSignup
              ? "Create your travel planner account with email and password."
              : "Access your trips and dashboard with email and password."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-text-body">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-lg border border-border-strong bg-surface-base px-3 text-text-primary outline-none focus:border-brand"
                placeholder="you@example.com"
              />
            </label>

            {isSignup && (
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-text-body">Name</span>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-11 w-full rounded-lg border border-border-strong bg-surface-base px-3 text-text-primary outline-none focus:border-brand"
                  placeholder="Your name"
                />
              </label>
            )}

            <label className="block">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-text-body">Password</span>
                {!isSignup && (
                  <button
                    type="button"
                    onClick={openForgot}
                    className="text-xs font-medium text-brand transition-colors hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-lg border border-border-strong bg-surface-base px-3 text-text-primary outline-none focus:border-brand"
                placeholder="Enter password"
              />
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-brand px-5 py-2.5 font-semibold text-white disabled:opacity-70"
            >
              {isLoading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-5 text-sm text-text-body">
            {isSignup ? "Already have an account?" : "New here?"}{" "}
            <Link
              href={isSignup ? "/auth/signin" : "/auth/signup"}
              className="font-semibold text-brand"
            >
              {isSignup ? "Sign in" : "Create account"}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
