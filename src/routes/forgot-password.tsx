import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, KeyRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Spinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, forgotPassword } from "@/integrations/api/endpoints";

const TITLE = "Reset your password — SurveyFlow";
const DESCRIPTION =
  "Request a password reset link for your SurveyFlow account and get back into your workspace.";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ForgotPasswordPage,
});

type Step = "request" | "reset" | "success";

function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("request");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRequestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Adjust the destructured field name if your API wraps it differently,
      // e.g. `{ data: { token } }` instead of `{ token }`.
      const response = await forgotPassword(email);
      const receivedToken = response as string | null;

      if (!receivedToken) {
        throw new Error("No reset token was returned. Please try again.");
      }

      setToken(receivedToken);
      setStep("reset");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't send a reset link. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("Your reset session expired. Please request a new link.");
      setStep("request");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(token, newPassword);
      setStep("success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't reset your password. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetFlow = () => {
    setStep("request");
    setToken(null);
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  };

  return (
    <AuthShell
      title={
        step === "success"
          ? "Password updated"
          : step === "reset"
            ? "Choose a new password"
            : "Reset your password"
      }
      description={
        step === "success"
          ? "Your password has been changed. You can now sign in with your new password."
          : step === "reset"
            ? "Enter a new password for your account."
            : "Enter the email you signed up with and we'll get you back in."
      }
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {step === "success" ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-foreground">Password updated</p>
            <p className="text-sm text-muted-foreground">
              You can now sign in with your new password.
            </p>
            <Button asChild size="sm" className="mt-2">
              <Link to="/login">Go to sign in</Link>
            </Button>
          </div>
        </div>
      ) : step === "reset" ? (
        <form className="space-y-5" onSubmit={handleResetSubmit}>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <Spinner label="Updating password" />
            ) : (
              <>
                <KeyRound className="size-4" aria-hidden="true" />
                Update password
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={resetFlow}
            disabled={submitting}
          >
            Start over
          </Button>
        </form>
      ) : (
        <form className="space-y-5" onSubmit={handleRequestSubmit}>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Spinner label="Sending link" /> : "Continue"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}