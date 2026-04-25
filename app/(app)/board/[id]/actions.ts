"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generatePosition } from "@/lib/position"

export async function createColumn(boardId: string, title: string, lastPosition?: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const position = generatePosition(lastPosition, undefined)

  const { data, error } = await supabase
    .from("columns")
    .insert({
      board_id: boardId,
      user_id: user.id,
      title,
      position,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/board/${boardId}`)
  return { data }
}

export async function updateColumn(columnId: string, title: string, boardId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("columns")
    .update({ title })
    .eq("id", columnId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/board/${boardId}`)
  return { success: true }
}

export async function deleteColumn(columnId: string, boardId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("columns")
    .delete()
    .eq("id", columnId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/board/${boardId}`)
  return { success: true }
}

export async function createCard(
  columnId: string,
  title: string,
  boardId: string,
  lastPosition?: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const position = generatePosition(lastPosition, undefined)

  const { data, error } = await supabase
    .from("cards")
    .insert({
      column_id: columnId,
      user_id: user.id,
      title,
      position,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/board/${boardId}`)
  return { data }
}

export async function updateCard(
  cardId: string,
  updates: { title?: string; description?: string },
  boardId: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("cards")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cardId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/board/${boardId}`)
  return { success: true }
}

export async function deleteCard(cardId: string, boardId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", cardId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/board/${boardId}`)
  return { success: true }
}

export async function moveCard(
  cardId: string,
  newColumnId: string,
  newPosition: string,
  boardId: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("cards")
    .update({
      column_id: newColumnId,
      position: newPosition,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cardId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/board/${boardId}`)
  return { success: true }
}
