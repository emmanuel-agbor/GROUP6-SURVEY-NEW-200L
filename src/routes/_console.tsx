import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/auth";

export const Route = createFileRoute("/_console")({
  component: ConsoleLayout,
});

/**
 * Authenticated workspace shell.
 * TODO: Integrate Spring Boot session check and redirect unauthenticated users to /login.
 */
function ConsoleLayout() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate({
        to: "/login",
        search: { redirect: window.location.href },
        replace: true,
      });
      return;
    }
    setChecked(true);
  }, [navigate]);

  if (!checked)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    ); // or a spinner
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <AppTopbar />
          <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8 sm:px-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
