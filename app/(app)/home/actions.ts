"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBoard(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const title = formData.get("title") as string
  const color = formData.get("color") as string

  const { data, error } = await supabase
    .from("boards")
    .insert({
      user_id: user.id,
      title,
      color: color || "indigo",
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Create default columns
  const defaultColumns = [
    { title: "To Do", position: "a" },
    { title: "In Progress", position: "n" },
    { title: "Done", position: "z" },
  ]

  await supabase.from("columns").insert(
    defaultColumns.map((col) => ({
      board_id: data.id,
      user_id: user.id,
      title: col.title,
      position: col.position,
    }))
  )

  revalidatePath("/home")
  return { data }
}

export async function deleteBoard(boardId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("boards")
    .delete()
    .eq("id", boardId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/home")
  return { success: true }
}

export async function updateBoard(boardId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const title = formData.get("title") as string
  const color = formData.get("color") as string

  const { error } = await supabase
    .from("boards")
    .update({
      title,
      color,
      updated_at: new Date().toISOString(),
    })
    .eq("id", boardId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/home")
  return { success: true }
}
