import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { managerNavConfig } from "@/config/nav"
import { cn } from "@/lib/utils"
import { Cigarette, type LucideIcon, Settings } from "lucide-react"
import Link from "next/link"

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
          {managerNavConfig.map((item, index) => (
            <SidebarNavItem
              key={`sidebar-${item.href}`}
              href={item.href}
              label={item.label}
              Icon={item.Icon}
              isActive={index === 0}
            />
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <SidebarNavItem href="#" label="Settings" Icon={Settings} />
        </nav>
      </TooltipProvider>
    </aside>
  )
}

interface SidebarItemProps {
  href: string
  label: string
  Icon: LucideIcon
  isActive?: boolean
}

function SidebarNavItem({ href, label, Icon, isActive }: SidebarItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8",
            isActive
              ? "bg-accent text-accent-foreground hover:text-foreground"
              : "text-muted-foreground hover:text-foreground ",
          )}
        >
          <Icon className="w-5 h-5" />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}
