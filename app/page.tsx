import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Kanban, CheckCircle2, Zap, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <Kanban className="h-8 w-8 text-primary-foreground" />
        </div>

        <h1 className="mt-6 text-center text-4xl font-bold tracking-tight text-foreground">
          TaskFlow
        </h1>
        <p className="mt-3 max-w-sm text-center text-lg text-muted-foreground">
          Organize your projects with a simple, beautiful Kanban board
        </p>

        {/* Features */}
        <div className="mt-10 flex flex-col gap-4 w-full max-w-sm">
          <div className="flex items-center gap-4 rounded-xl bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Track Tasks</p>
              <p className="text-sm text-muted-foreground">Create boards, columns, and cards</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Drag & Drop</p>
              <p className="text-sm text-muted-foreground">Move cards between columns effortlessly</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Your Workflow</p>
              <p className="text-sm text-muted-foreground">Customize boards to fit your needs</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
          <Button asChild size="lg" className="h-14 text-base font-semibold">
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 text-base font-semibold">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Built with care for productivity
        </p>
      </div>
    </div>
  )
}
