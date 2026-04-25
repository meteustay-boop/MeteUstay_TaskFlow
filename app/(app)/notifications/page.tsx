import { MobileHeader } from "@/components/layout/mobile-header"
import { Bell } from "lucide-react"

export default function NotificationsPage() {
  return (
    <>
      <MobileHeader title="Activity" />
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Bell className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">Activity</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Activity feed coming soon
        </p>
      </div>
    </>
  )
}
