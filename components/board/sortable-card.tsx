"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/lib/types"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortableCardProps {
  card: Card
  onClick: () => void
}

export function SortableCard({ card, onClick }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-start gap-2 rounded-xl bg-card p-4 shadow-sm transition-shadow",
        "border border-border/50",
        isDragging && "opacity-50 shadow-lg rotate-2 scale-105",
        !isDragging && "hover:shadow-md active:scale-[0.98]"
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 touch-none rounded p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted focus:opacity-100"
        aria-label="Drag handle"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Card Content */}
      <button
        onClick={onClick}
        className="flex-1 text-left min-w-0"
      >
        <p className="font-medium text-foreground line-clamp-3">
          {card.title}
        </p>
        {card.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {card.description}
          </p>
        )}
      </button>
    </div>
  )
}
