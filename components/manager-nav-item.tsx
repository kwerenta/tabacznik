"use client"

import type { NavItem } from "@/config/nav"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

function useIsActivePath(href: string) {
  const pathname = usePathname()
  return pathname === href || (href !== "/manager" && pathname.startsWith(href))
}

interface NavItemProps extends Omit<NavItem, "Icon"> {
  children: React.ReactNode
}

export function SidebarNavItem({ href, label, children }: NavItemProps) {
  const isActive = useIsActivePath(href)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8",
            isActive
              ? "bg-accent text-accent-foreground hover:text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {children}
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

export function MobileNavItem({ href, label, children }: NavItemProps) {
  const isActive = useIsActivePath(href)

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 px-2.5",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
      {label}
    </Link>
  )
}
