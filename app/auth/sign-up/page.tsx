"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Kanban, Mail, Lock, User, Loader2 } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()

    // Sign up with auto-confirm (no email verification)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split("@")[0],
        },
      },
    })

    console.log("[v0] Sign up result:", { data, signUpError })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Check if user needs email confirmation
    if (data.user && !data.session) {
      console.log("[v0] User created but no session - email confirmation might be required")
      // Try to sign in anyway - if email confirmation is disabled in Supabase, this will work
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log("[v0] Sign in attempt result:", { signInData, signInError })

      if (signInError) {
        // If sign in fails, it's likely email confirmation is enabled
        setError("Account created! Please check your email to confirm, or contact admin to disable email confirmation.")
        setLoading(false)
        return
      }
    }

    console.log("[v0] Redirecting to /home")
    // Redirect directly to home - no confirmation needed
    router.push("/home")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 pt-12 pb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <Kanban className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">TaskFlow</span>
      </div>

      {/* Form Container */}
      <div className="flex flex-1 flex-col px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create account</h1>
          <p className="mt-2 text-muted-foreground">Start organizing your tasks today</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-14 pl-12 text-base"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 pl-12 text-base"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 pl-12 text-base"
              minLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            className="mt-4 h-14 text-base font-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="mt-auto pb-8 pt-8 text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
