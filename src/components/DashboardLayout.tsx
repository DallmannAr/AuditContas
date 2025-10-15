import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, FileText, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-48 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
            Logo
          </div>
          <span className="font-semibold">Dashboard</span>
        </div>

        {/* User Section */}
        <div className="p-4 border-b border-border">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 w-full text-sm hover:bg-muted p-2 rounded-md transition-colors">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                U
              </div>
              <span className="flex-1 text-left truncate">user_name</span>
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>user_account2</DropdownMenuItem>
              <DropdownMenuItem>user_account3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="text-sm text-muted-foreground hover:text-foreground mt-2 underline">
            Adicionar Conta
          </button>
        </div>

        {/* Actions */}
        <div className="p-4 flex-1">
          <h3 className="text-sm font-semibold mb-3">Ações</h3>
          <nav className="space-y-1">
            <button className="flex items-center gap-2 text-sm hover:bg-muted p-2 rounded-md w-full text-left transition-colors">
              <FileText className="w-4 h-4" />
              Comparar
            </button>
            <button className="flex items-center gap-2 text-sm hover:bg-muted p-2 rounded-md w-full text-left transition-colors">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
