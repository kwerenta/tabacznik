"use client"

import { type NavItem, managerNavConfig } from "@/config/nav"
import { usePathname } from "next/navigation"
import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"

export function ManagerBreadcrumbList() {
  const pathname = usePathname()
  const navItem = managerNavConfig.find(
    ({ href }) =>
      pathname === href || (href !== "/manager" && pathname.startsWith(href)),
  )
  if (!navItem) return null

  const segments = navItem.href.substring(1).split("/")

  const items = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`
    return {
      href,
      label:
        managerNavConfig.find((item) => item.href === href)?.label ?? segment,
    }
  })

  const additionalSegment: Omit<NavItem, "Icon"> | null =
    pathname !== navItem.href
      ? {
          href: "#",
          label: `${pathname.split("/").at(-1)} ${segments.at(-1)?.slice(0, -1)}`,
        }
      : null

  if (additionalSegment) items.push(additionalSegment)

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {items.map(({ label, href }, index) => {
          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <BreadcrumbPage className="capitalize">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index !== items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
