"use client"

import { useRouter } from "next/navigation"
import { MobileHeader } from "@/components/layout/mobile-header"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { LogOut, User as UserIcon } from "lucide-react"

interface ProfileContentProps {
  user: User
}

export function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "User"

  return (
    <>
      <MobileHeader title="Profile" />
      <div className="flex flex-col items-center px-6 py-8">
        {/* Avatar */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
          <UserIcon className="h-10 w-10 text-primary-foreground" />
        </div>

        {/* User Info */}
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {displayName}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>

        {/* Actions */}
        <div className="mt-8 w-full max-w-sm">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="h-14 w-full justify-start gap-3 text-base"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  )
}
