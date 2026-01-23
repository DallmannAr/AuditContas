import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Upload,
  Search,
  Settings,
  CircleDollarSign,
  Crown
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { useTranslation } from '@/lib/translations';

export function MenuSidebar() {

  const { t } = useTranslation();
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const collapsed = state === "collapsed";

  const mainItems = [
  { title: t.nav.home , url: "/home", icon: Home },
  { title: t.nav.plans, url: "/plans", icon: Crown,}
];

const toolsItems = [
  { title: t.nav.search, url: "/search", icon: Search },
  { title: t.nav.reports, url: "/table-upload", icon: Upload },
];


  return (
    <Sidebar
      className={`border-r border-border transition-all duration-300 ${
        collapsed ? "w-14" : "w-60"
      }`}
      collapsible="icon"
    >
      <div className="flex h-full flex-col bg-card">
        {/* Logo Section */}
        <div className="flex items-center justify-between border-b border-border p-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <CircleDollarSign className="h-5 w-5" />
              </div>
              <span className="font-bold text-foreground">Dashboard</span>
            </div>
          )}
          <SidebarTrigger className={collapsed ? "mx-auto " : ""} />
        </div>

        <SidebarContent>
          {/* Main Section */}
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase text-muted-foreground">
                Main
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`${
                        isActive(item.url)
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <NavLink to={item.url} end>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Tools Section */}
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase text-muted-foreground">
                {t.nav.tools}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {toolsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`${
                        isActive(item.url)
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <NavLink to={item.url}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Settings at Bottom */}
        <div className="mt-auto border-t border-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={`${
                  isActive("/settings")
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <NavLink to="/settings">
                  <Settings className="h-4 w-4" />
                  {!collapsed && <span>{t.nav.settings}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </div>
    </Sidebar>
  );
}
