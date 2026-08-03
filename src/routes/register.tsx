import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Spinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/integrations/api/endpoints";
import { toast } from "sonner";
import { storeAuthResponse } from "@/lib/auth";
import { AuthResponse } from "@/types/auth.types";

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
  const navigation = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // TODO: Integrate Spring Boot endpoint for registering a new user.
    register(payload)
      .then((response) => {
        if (!response) throw new Error("No response returned from registration.");

        const authResponse = response as AuthResponse;

        toast.success("Account created successfully!!");
        storeAuthResponse(authResponse);
        navigation.navigate({ to: "/dashboard" });
      })
      .catch((error) => {
        toast.error(error.message || "An error occurred while creating the account.");
      })
      .finally(() => {
        setSubmitting(false);
      });
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
          <Label htmlFor="register-firstName">First name</Label>
          <Input
            id="register-firstName"
            name="firstName"
            autoComplete="first Name"
            required
            placeholder="Alex"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-lastName">Last name</Label>
          <Input
            id="register-lastName"
            name="lastName"
            autoComplete="last Name"
            required
            placeholder="Morgan"
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
