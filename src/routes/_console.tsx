import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_console")({
  component: ConsoleLayout,
});

/**
 * Authenticated workspace shell.
 * TODO: Integrate Spring Boot session check and redirect unauthenticated users to /login.
 */
function ConsoleLayout() {
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
