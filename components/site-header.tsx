import { validateRequest } from "@/lib/auth"
import { Cigarette, LogIn, PanelLeft, Search, Store, User } from "lucide-react"
import Link from "next/link"
import { CartHeaderButton } from "./cart-header-button"
import { LogoutDropdownItem } from "./logout-dropdown-item"
import { Button, buttonVariants } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

export async function SiteHeader() {
  const { user } = await validateRequest()

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="container flex h-14 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="md:hidden">
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
              <Input
                type="search"
                className="text-xs"
                placeholder="Search products..."
              />
              <Link href="/products" className="hover:underline">
                Products
              </Link>
              <Link href="#" className="hover:underline">
                About Us
              </Link>
              <Link href="/manager" className="hover:underline">
                Manager
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <nav className="flex-1 flex gap-4 items-center">
          <Link href="/products" className="hover:underline hidden md:inline">
            Products
          </Link>
          <Link href="#" className="hover:underline hidden md:inline">
            About Us
          </Link>
        </nav>
        <Link href="/" className="flex items-center group gap-2">
          <div className="flex items-center justify-center bg-primary rounded-full size-9">
            <Cigarette className="size-6 transition-all group-hover:scale-110" />
          </div>
          <h1 className="text-2xl font-semibold">tabacznik</h1>
        </Link>
        <nav className="flex-1 flex justify-end gap-2 items-center">
          <div className="hidden md:flex items-center pl-4">
            <Button type="button" size="icon" className="rounded-r-none">
              <Search className="size-4" />
            </Button>
            <Input
              type="search"
              className="max-w-52 text-xs rounded-l-none"
              placeholder="Search products..."
            />
          </div>
          <TooltipProvider>
            <CartHeaderButton />
            {user ? (
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <User className="size-5" />
                        <span className="sr-only">Open user menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>User</TooltipContent>
                </Tooltip>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href="#">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <LogoutDropdownItem />
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/login"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "icon",
                      className: "shrink-0",
                    })}
                  >
                    <LogIn className="size-5" />
                    <span className="sr-only">Login</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Login</TooltipContent>
              </Tooltip>
            )}
            {user?.isManager && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/manager"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "icon",
                      className: "hidden md:inline-flex shrink-0",
                    })}
                  >
                    <Store className="size-5 text-primary" />
                    <span className="sr-only">Go to manager dashboard</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Manager</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </nav>
      </div>
    </header>
  )
}
