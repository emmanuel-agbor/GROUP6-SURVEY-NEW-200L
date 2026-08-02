import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Spinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TITLE = "Sign in — SurveyFlow";
const DESCRIPTION = "Sign in to your SurveyFlow workspace to manage surveys and review responses.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    // TODO: Integrate Spring Boot endpoint for authenticating the user.
    setSubmitting(false);
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to pick up where your surveys left off."
      footer={
        <>
          New to SurveyFlow?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate={false}>
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="login-remember" name="remember" />
          <Label htmlFor="login-remember" className="text-sm font-normal text-muted-foreground">
            Remember me on this device
          </Label>
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? <Spinner label="Signing in" /> : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
