import { ManagerHeader } from "@/components/manager-header"
import { ManagerSidebar } from "@/components/manager-sidebar"

export default function ManagerLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <ManagerSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <ManagerHeader />
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </div>
    </div>
  )
}
