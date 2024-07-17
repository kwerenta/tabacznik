import { TooltipProvider } from "@/components/ui/tooltip"
import { managerNavConfig } from "@/config/nav"
import { Cigarette, Settings } from "lucide-react"
import Link from "next/link"
import { SidebarNavItem } from "./manager-nav-item"

export function ManagerSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Cigarette className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Tabacznik</span>
          </Link>
          {managerNavConfig.map((item) => (
            <SidebarNavItem
              key={`sidebar-${item.label}`}
              href={item.href}
              label={item.label}
            >
              <item.Icon className="w-5 h-5" />
            </SidebarNavItem>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <SidebarNavItem href="#" label="Settings">
            <Settings className="w-5 h-5" />
          </SidebarNavItem>
        </nav>
      </TooltipProvider>
    </aside>
  )
}
