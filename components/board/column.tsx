"use client"

import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { ColumnWithCards, Card } from "@/lib/types"
import { SortableCard } from "./sortable-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, MoreHorizontal, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createCard, deleteColumn, updateColumn } from "@/app/(app)/board/[id]/actions"
import { cn } from "@/lib/utils"

interface ColumnProps {
  column: ColumnWithCards
  boardId: string
  onCardClick: (card: Card) => void
}

export function Column({ column, boardId, onCardClick }: ColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(column.title)

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  })

  async function handleAddCard(e: React.FormEvent) {
    e.preventDefault()
    if (!newCardTitle.trim()) return

    setIsLoading(true)
    const lastCard = column.cards[column.cards.length - 1]
    await createCard(column.id, newCardTitle.trim(), boardId, lastCard?.position)
    setNewCardTitle("")
    setIsAddingCard(false)
    setIsLoading(false)
  }

  async function handleDeleteColumn() {
    if (confirm("Delete this column and all its cards?")) {
      await deleteColumn(column.id, boardId)
    }
  }

  async function handleUpdateTitle(e: React.FormEvent) {
    e.preventDefault()
    if (editTitle.trim() && editTitle !== column.title) {
      await updateColumn(column.id, editTitle.trim(), boardId)
    }
    setIsEditing(false)
  }

  const cardIds = column.cards.map((card) => card.id)

  return (
    <div
      className={cn(
        "flex h-full w-72 flex-shrink-0 flex-col rounded-xl bg-muted/50",
        isOver && "ring-2 ring-primary"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-3">
        {isEditing ? (
          <form onSubmit={handleUpdateTitle} className="flex-1">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleUpdateTitle}
              autoFocus
              className="h-8"
            />
          </form>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-left"
          >
            <h3 className="font-semibold text-foreground">{column.title}</h3>
            <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
              {column.cards.length}
            </span>
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteColumn}
              className="text-destructive focus:text-destructive"
            >
              Delete Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto px-3 pb-3 space-y-3"
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>

        {/* Add Card Form */}
        {isAddingCard ? (
          <form onSubmit={handleAddCard} className="space-y-2">
            <Input
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter card title..."
              autoFocus
              className="min-h-[44px]"
              onBlur={() => {
                if (!newCardTitle.trim()) {
                  setIsAddingCard(false)
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !newCardTitle.trim()}
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
                  setIsAddingCard(false)
                  setNewCardTitle("")
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingCard(true)}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        )}
      </div>
    </div>
  )
}
