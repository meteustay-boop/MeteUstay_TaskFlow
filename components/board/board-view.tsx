"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { BoardWithColumns, Card, ColumnWithCards } from "@/lib/types"
import { Column } from "./column"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Loader2 } from "lucide-react"
import { createColumn, moveCard } from "@/app/(app)/board/[id]/actions"
import { generatePosition, sortByPosition } from "@/lib/position"
import { CardDetailSheet } from "./card-detail-sheet"

interface BoardViewProps {
  board: BoardWithColumns
}

export function BoardView({ board }: BoardViewProps) {
  // Sort columns and cards by position
  const initialColumns = sortByPosition(board.columns).map((col) => ({
    ...col,
    cards: sortByPosition(col.cards),
  }))

  const [columns, setColumns] = useState<ColumnWithCards[]>(initialColumns)
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 8,
      },
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    const activeData = active.data.current

    if (activeData?.type === "card") {
      setActiveCard(activeData.card)
    }
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    if (activeData?.type !== "card") return

    const activeCard = activeData.card as Card
    const activeColumnId = activeCard.column_id

    let overColumnId: string

    if (overData?.type === "column") {
      overColumnId = (overData.column as ColumnWithCards).id
    } else if (overData?.type === "card") {
      overColumnId = (overData.card as Card).column_id
    } else {
      // Dropped on empty column
      overColumnId = over.id as string
    }

    if (activeColumnId === overColumnId) return

    setColumns((prev) => {
      const activeColumn = prev.find((col) => col.id === activeColumnId)
      const overColumn = prev.find((col) => col.id === overColumnId)

      if (!activeColumn || !overColumn) return prev

      const activeCardIndex = activeColumn.cards.findIndex(
        (card) => card.id === activeCard.id
      )

      const movedCard = {
        ...activeColumn.cards[activeCardIndex],
        column_id: overColumnId,
      }

      return prev.map((col) => {
        if (col.id === activeColumnId) {
          return {
            ...col,
            cards: col.cards.filter((card) => card.id !== activeCard.id),
          }
        }
        if (col.id === overColumnId) {
          return {
            ...col,
            cards: [...col.cards, movedCard],
          }
        }
        return col
      })
    })
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveCard(null)

      if (!over) return

      const activeData = active.data.current
      const overData = over.data.current

      if (activeData?.type !== "card") return

      const activeCard = activeData.card as Card

      setColumns((prev) => {
        // Find the column containing the active card
        const sourceColumn = prev.find((col) =>
          col.cards.some((card) => card.id === activeCard.id)
        )
        if (!sourceColumn) return prev

        const activeIndex = sourceColumn.cards.findIndex(
          (card) => card.id === activeCard.id
        )

        let overIndex: number
        let targetColumnId: string

        if (overData?.type === "card") {
          const overCard = overData.card as Card
          targetColumnId = overCard.column_id
          const targetColumn = prev.find((col) => col.id === targetColumnId)
          if (!targetColumn) return prev
          overIndex = targetColumn.cards.findIndex((card) => card.id === overCard.id)
        } else if (overData?.type === "column") {
          targetColumnId = (overData.column as ColumnWithCards).id
          overIndex = prev.find((col) => col.id === targetColumnId)?.cards.length || 0
        } else {
          targetColumnId = over.id as string
          overIndex = prev.find((col) => col.id === targetColumnId)?.cards.length || 0
        }

        const targetColumn = prev.find((col) => col.id === targetColumnId)
        if (!targetColumn) return prev

        // Calculate new position
        const cards = targetColumn.cards
        let newPosition: string

        if (cards.length === 0) {
          newPosition = "n"
        } else if (overIndex === 0) {
          newPosition = generatePosition(undefined, cards[0]?.position)
        } else if (overIndex >= cards.length) {
          newPosition = generatePosition(cards[cards.length - 1]?.position, undefined)
        } else {
          const beforeCard = cards[overIndex - 1]
          const afterCard = cards[overIndex]
          newPosition = generatePosition(beforeCard?.position, afterCard?.position)
        }

        // Update server
        moveCard(activeCard.id, targetColumnId, newPosition, board.id)

        // Update local state
        if (sourceColumn.id === targetColumnId) {
          // Same column, just reorder
          const newCards = arrayMove(sourceColumn.cards, activeIndex, overIndex)
          return prev.map((col) =>
            col.id === sourceColumn.id
              ? {
                  ...col,
                  cards: newCards.map((card, idx) =>
                    card.id === activeCard.id
                      ? { ...card, position: newPosition }
                      : card
                  ),
                }
              : col
          )
        }

        // Different column
        return prev.map((col) => {
          if (col.id === sourceColumn.id) {
            return {
              ...col,
              cards: col.cards.filter((card) => card.id !== activeCard.id),
            }
          }
          if (col.id === targetColumnId) {
            const updatedCard = { ...activeCard, column_id: targetColumnId, position: newPosition }
            const newCards = [...col.cards]
            newCards.splice(overIndex, 0, updatedCard)
            return {
              ...col,
              cards: sortByPosition(newCards),
            }
          }
          return col
        })
      })
    },
    [board.id]
  )

  async function handleAddColumn(e: React.FormEvent) {
    e.preventDefault()
    if (!newColumnTitle.trim()) return

    setIsLoading(true)
    const lastColumn = columns[columns.length - 1]
    await createColumn(board.id, newColumnTitle.trim(), lastColumn?.position)
    setNewColumnTitle("")
    setIsAddingColumn(false)
    setIsLoading(false)
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-4 overflow-x-auto p-4 pb-8">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              boardId={board.id}
              onCardClick={setSelectedCard}
            />
          ))}

          {/* Add Column */}
          <div className="w-72 flex-shrink-0">
            {isAddingColumn ? (
              <form
                onSubmit={handleAddColumn}
                className="space-y-2 rounded-xl bg-muted/50 p-3"
              >
                <Input
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Column title..."
                  autoFocus
                  className="min-h-[44px]"
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading || !newColumnTitle.trim()}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsAddingColumn(false)
                      setNewColumnTitle("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setIsAddingColumn(true)}
                className="h-12 w-full justify-start rounded-xl border-2 border-dashed border-muted-foreground/25 text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Column
              </Button>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeCard && (
            <div className="rotate-3 scale-105 rounded-xl bg-card p-4 shadow-xl border border-primary">
              <p className="font-medium text-foreground">{activeCard.title}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <CardDetailSheet
        card={selectedCard}
        boardId={board.id}
        onClose={() => setSelectedCard(null)}
      />
    </>
  )
}
