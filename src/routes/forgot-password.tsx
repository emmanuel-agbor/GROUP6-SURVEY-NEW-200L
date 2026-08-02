import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Spinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    // TODO: Integrate Spring Boot endpoint for sending a password reset email.
    setSubmitting(false);
    setSent(true);
  };

  return (
    <AuthShell
      title={sent ? "Check your inbox" : "Reset your password"}
      description={
        sent
          ? "If an account matches that address, a reset link is on its way."
          : "Enter the email you signed up with and we'll send a reset link."
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
      {sent ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-foreground">Reset link sent</p>
            <p className="text-sm text-muted-foreground">
              The link expires in 30 minutes. Check your spam folder if it hasn't arrived in a few
              minutes.
            </p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setSent(false)}>
              Use a different email
            </Button>
          </div>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Spinner label="Sending link" /> : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
