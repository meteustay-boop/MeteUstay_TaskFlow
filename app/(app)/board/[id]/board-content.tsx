"use client"

import { useRouter } from "next/navigation"
import { MobileHeader } from "@/components/layout/mobile-header"
import { BoardView } from "@/components/board/board-view"
import { BoardWithColumns } from "@/lib/types"
import { deleteBoard } from "@/app/(app)/home/actions"

interface BoardContentProps {
  board: BoardWithColumns
}

export function BoardContent({ board }: BoardContentProps) {
  const router = useRouter()

  async function handleDeleteBoard() {
    if (confirm("Delete this board and all its content?")) {
      await deleteBoard(board.id)
      router.push("/home")
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <MobileHeader
        title={board.title}
        showBack
        actions={[
          {
            label: "Delete Board",
            onClick: handleDeleteBoard,
            destructive: true,
          },
        ]}
      />
      <div className="flex-1 overflow-hidden">
        <BoardView board={board} />
      </div>
    </div>
  )
}
