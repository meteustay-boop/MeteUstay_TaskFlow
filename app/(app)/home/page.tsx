import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { HomeContent } from "./home-content"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: boards } = await supabase
    .from("boards")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  return <HomeContent boards={boards || []} />
}
