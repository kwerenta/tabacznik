import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { managerNavConfig } from "@/config/nav"
import { cn } from "@/lib/utils"
import {
  Cigarette,
  type LucideIcon,
  PanelLeft,
  Settings,
  User,
} from "lucide-react"
import Link from "next/link"
import { LogoutDropdownItem } from "./logout-dropdown-item"

export function ManagerHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <SheetTitle>
              <Link
                href="/"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <Cigarette className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">Tabacznik</span>
              </Link>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Mobile navigation
            </SheetDescription>
            {managerNavConfig.map((item, index) => (
              <MobileNavItem
                key={`mobile-${item.href}`}
                href={item.href}
                label={item.label}
                Icon={item.Icon}
                isActive={index === 0}
              />
            ))}
            <MobileNavItem href="#" label="Settings" Icon={Settings} />
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="ml-auto">
          <Button variant="outline" size="icon" className="rounded-full">
            <User />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <LogoutDropdownItem />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

interface MobileNavItemProps {
  href: string
  label: string
  Icon: LucideIcon
  isActive?: boolean
}

function MobileNavItem({ href, label, Icon, isActive }: MobileNavItemProps) {
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
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  )
}
