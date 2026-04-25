"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/layout/mobile-header"
import { FAB } from "@/components/layout/fab"
import { BoardGrid } from "@/components/boards/board-grid"
import { CreateBoardSheet } from "@/components/boards/create-board-sheet"
import { Board } from "@/lib/types"

interface HomeContentProps {
  boards: Board[]
}

export function HomeContent({ boards }: HomeContentProps) {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <MobileHeader title="My Boards" />
      <BoardGrid boards={boards} />
      <FAB onClick={() => setCreateOpen(true)} />
      <CreateBoardSheet open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
