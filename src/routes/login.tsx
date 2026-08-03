import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Spinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/integrations/api/endpoints";
import { AuthResponse } from "@/types/auth.types";
import { toast } from "sonner";
import { storeAuthResponse } from "@/lib/auth";

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
  const navigation = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      remember: formData.get("remember") === "on",
    };

    // TODO: Integrate Spring Boot endpoint for authenticating the user.
    login(payload)
      .then((response) => {
        if (!response) throw new Error("No response returned from login.");

        const authResponse = response as AuthResponse;

        toast.success("Signed in successfully!!");
        storeAuthResponse(authResponse);
        navigation.navigate({ to: "/dashboard" });
      })
      .catch((error) => {
        toast.error(error.message || "An error occurred while signing in.");
      })
      .finally(() => {
        setSubmitting(false);
      });
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
