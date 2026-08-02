import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Spinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TITLE = "Create your account — SurveyFlow";
const DESCRIPTION =
  "Create a free SurveyFlow account to build surveys, collect responses, and share results with your team.";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    // TODO: Integrate Spring Boot endpoint for registering a new user.
    setSubmitting(false);
  };

  return (
    <AuthShell
      title="Create your workspace"
      description="It takes a minute, and your first survey is free."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="register-name">Full name</Label>
          <Input
            id="register-name"
            name="fullName"
            autoComplete="name"
            required
            placeholder="Alex Morgan"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              aria-describedby="register-password-hint"
              placeholder="••••••••"
            />
            <p id="register-password-hint" className="text-xs text-muted-foreground">
              At least 8 characters.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-confirm">Confirm password</Label>
            <Input
              id="register-confirm"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="••••••••"
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="register-terms"
            name="terms"
            checked={accepted}
            onCheckedChange={(value) => setAccepted(value === true)}
            required
          />
          <Label htmlFor="register-terms" className="text-sm font-normal text-muted-foreground">
            I agree to the Terms of Service and Privacy Policy.
          </Label>
        </div>
        <Button type="submit" className="w-full" disabled={submitting || !accepted}>
          {submitting ? <Spinner label="Creating account" /> : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
