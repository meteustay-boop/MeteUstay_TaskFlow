export interface Board {
  id: string
  user_id: string
  title: string
  color: string
  created_at: string
  updated_at: string
}

export interface Column {
  id: string
  board_id: string
  user_id: string
  title: string
  position: string
  created_at: string
}

export interface Card {
  id: string
  column_id: string
  user_id: string
  title: string
  description: string
  position: string
  created_at: string
  updated_at: string
}

export interface ColumnWithCards extends Column {
  cards: Card[]
}

export interface BoardWithColumns extends Board {
  columns: ColumnWithCards[]
}

// Board colors for selection
export const BOARD_COLORS = [
  { name: "Indigo", value: "indigo", class: "bg-indigo-500" },
  { name: "Blue", value: "blue", class: "bg-blue-500" },
  { name: "Green", value: "green", class: "bg-emerald-500" },
  { name: "Yellow", value: "yellow", class: "bg-amber-500" },
  { name: "Red", value: "red", class: "bg-red-500" },
  { name: "Pink", value: "pink", class: "bg-pink-500" },
] as const

export function getBoardColorClass(color: string): string {
  const found = BOARD_COLORS.find((c) => c.value === color)
  return found?.class ?? "bg-indigo-500"
}
