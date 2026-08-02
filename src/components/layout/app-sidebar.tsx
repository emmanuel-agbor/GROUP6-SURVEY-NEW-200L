import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, FilePlus2, Inbox, LayoutDashboard, ListChecks, Settings, User } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const WORKSPACE_LINKS = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Surveys", url: "/surveys", icon: ListChecks },
  { title: "Create survey", url: "/surveys/new", icon: FilePlus2 },
  { title: "Responses", url: "/responses", icon: Inbox },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
] as const;

const ACCOUNT_LINKS = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (router) => router.location.pathname });

  const renderMenu = (items: readonly { title: string; url: string; icon: typeof User }[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton asChild isActive={pathname === item.url}>
            <Link to={item.url} className="flex items-center gap-2">
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Brand to="/dashboard" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>{renderMenu(WORKSPACE_LINKS)}</SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>{renderMenu(ACCOUNT_LINKS)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3 py-4 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
        SurveyFlow · v1.0
      </SidebarFooter>
    </Sidebar>
  );
}