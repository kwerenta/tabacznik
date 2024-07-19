import {
  Home,
  LineChart,
  type LucideIcon,
  Package,
  ShoppingCart,
  Users2,
} from "lucide-react"

export interface NavItem {
  href: string
  label: string
  Icon: LucideIcon
}

export const managerNavConfig: NavItem[] = [
  {
    label: "Dashboard",
    href: "/manager",
    Icon: Home,
  },
  {
    label: "Orders",
    href: "/manager/orders",
    Icon: ShoppingCart,
  },
  {
    label: "Products",
    href: "/manager/products",
    Icon: Package,
  },
  {
    label: "Customers",
    href: "/manager/customers",
    Icon: Users2,
  },
  {
    label: "Analytics",
    href: "#",
    Icon: LineChart,
  },
]
