import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/lib/use-theme";

const TITLE = "Settings — SurveyFlow";
const DESCRIPTION =
  "Manage workspace details, appearance, notification preferences, and destructive account actions.";

export const Route = createFileRoute("/_console/settings")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: SettingsPage,
});

const NOTIFICATIONS = [
  {
    id: "notify-responses",
    label: "New response received",
    description: "Email me whenever someone submits one of my surveys.",
  },
  {
    id: "notify-weekly",
    label: "Weekly summary",
    description: "A Monday digest of response volume and completion rate.",
  },
  {
    id: "notify-product",
    label: "Product updates",
    description: "Occasional notes about new SurveyFlow features.",
  },
];

function SettingsPage() {
  const { preference, setPreference } = useTheme();

  return (
    <>
      <PageHeader title="Settings" description="Workspace, appearance, and notifications." />

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Shown to respondents on public survey pages.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              // TODO: Integrate Spring Boot endpoint for updating workspace settings.
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace name</Label>
                <Input id="workspace-name" name="workspaceName" placeholder="Acme Research" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-timezone">Time zone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="workspace-timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="cet">Central European Time</SelectItem>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="ist">India Standard Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit">Save workspace</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Applies to this browser only.</CardDescription>
        </CardHeader>
        <CardContent className="max-w-xs space-y-2">
          <Label htmlFor="appearance-theme">Theme</Label>
          <Select
            value={preference}
            onValueChange={(value) => setPreference(value as typeof preference)}
          >
            <SelectTrigger id="appearance-theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">Match system</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what SurveyFlow emails you about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {NOTIFICATIONS.map((item, index) => (
            <div key={item.id}>
              {index > 0 ? <Separator className="mb-4" /> : null}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <Label htmlFor={item.id} className="text-sm font-medium">
                    {item.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {/* TODO: Integrate Spring Boot endpoint for saving notification preferences. */}
                <Switch id={item.id} className="shrink-0" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>
            Deleting your account removes every survey and response permanently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: Integrate Spring Boot endpoint for deleting the account. */}
          <Button variant="destructive">Delete account</Button>
        </CardContent>
      </Card>
    </>
  );
}