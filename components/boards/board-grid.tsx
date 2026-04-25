"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Board, getBoardColorClass } from "@/lib/types"
import { Kanban } from "lucide-react"
import { cn } from "@/lib/utils"

interface BoardGridProps {
  boards: Board[]
}

export function BoardGrid({ boards }: BoardGridProps) {
  if (boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Kanban className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">No boards yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first board to start organizing tasks
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {boards.map((board) => (
        <Link
          key={board.id}
          href={`/board/${board.id}`}
          className="group relative flex flex-col overflow-hidden rounded-xl bg-card transition-transform active:scale-[0.98]"
        >
          {/* Color Header */}
          <div className={cn("h-20", getBoardColorClass(board.color))} />

          {/* Board Info */}
          <div className="flex flex-1 flex-col p-3">
            <h3 className="font-semibold text-foreground line-clamp-2">
              {board.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(board.updated_at), { addSuffix: true })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
