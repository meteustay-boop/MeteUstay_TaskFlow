import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { BoardContent } from "./board-content"
import { sortByPosition } from "@/lib/position"

interface BoardPageProps {
  params: Promise<{ id: string }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch board
  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (boardError || !board) {
    notFound()
  }

  // Fetch columns
  const { data: columns } = await supabase
    .from("columns")
    .select("*")
    .eq("board_id", id)
    .eq("user_id", user.id)

  // Fetch cards for all columns
  const columnIds = columns?.map((c) => c.id) || []
  const { data: cards } = await supabase
    .from("cards")
    .select("*")
    .in("column_id", columnIds)
    .eq("user_id", user.id)

  // Combine columns with their cards
  const columnsWithCards = sortByPosition(columns || []).map((column) => ({
    ...column,
    cards: sortByPosition((cards || []).filter((card) => card.column_id === column.id)),
  }))

  const boardWithColumns = {
    ...board,
    columns: columnsWithCards,
  }

  return <BoardContent board={boardWithColumns} />
}
