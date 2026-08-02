import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { pendingResource } from "@/lib/api-placeholder";
import type { UserProfile } from "@/types/survey";

const TITLE = "Your profile — SurveyFlow";
const DESCRIPTION =
  "Update your SurveyFlow name, email, role, and password from a single profile screen.";

export const Route = createFileRoute("/_console/profile")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  // TODO: Integrate Spring Boot endpoint for fetching the signed-in user's profile.
  const profile = pendingResource<UserProfile>();
  const [saved, setSaved] = useState(false);

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Integrate Spring Boot endpoint for updating the user's profile.
    setSaved(true);
  };

  const initials = (profile?.fullName ?? "SF")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <PageHeader title="Profile" description="Your account details and sign-in credentials." />

      <Card>
        <CardHeader className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <Avatar className="size-14 shrink-0">
            <AvatarFallback className="text-base">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="truncate">{profile?.fullName ?? "Your name"}</CardTitle>
            <CardDescription className="truncate">
              {profile?.email ?? "Connect the API to load your account"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleProfileSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  name="fullName"
                  autoComplete="name"
                  defaultValue={profile?.fullName ?? ""}
                  placeholder="Alex Morgan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={profile?.email ?? ""}
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-bio">About</Label>
              <Textarea
                id="profile-bio"
                name="bio"
                rows={3}
                placeholder="A short line your teammates see next to your name."
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit">Save changes</Button>
              {saved ? (
                <p role="status" className="text-sm text-success">
                  Saved locally — connect the API to persist.
                </p>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Use at least 8 characters, including a number.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              // TODO: Integrate Spring Boot endpoint for changing the user's password.
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="profile-current-password">Current password</Label>
              <Input
                id="profile-current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-new-password">New password</Label>
                <Input
                  id="profile-new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-confirm-password">Confirm new password</Label>
                <Input
                  id="profile-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>
            </div>
            <Button type="submit" variant="outline">
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}