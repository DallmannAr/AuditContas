import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MenuSidebar } from "@/components/MenuSidebar";
import { ThemeChanger } from "@/lib/ThemeChanger";
import { ThemeProvider } from "next-themes";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
     <ThemeProvider
    attribute='class'
    defaultTheme="light"
    enableSystem={false}> 
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <MenuSidebar />
        <main className="flex-1">{children}</main>

        <ThemeChanger/> 
      </div>
    </SidebarProvider>
    </ThemeProvider>
  );
}
