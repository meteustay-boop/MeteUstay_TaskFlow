import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, Kanban } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
        <Kanban className="h-6 w-6 text-primary-foreground" />
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Authentication Error</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Something went wrong during authentication. Please try again.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
        <Button asChild className="h-14">
          <Link href="/auth/login">Back to Sign In</Link>
        </Button>
        <Button asChild variant="outline" className="h-14">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
