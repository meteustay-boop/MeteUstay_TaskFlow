"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { BOARD_COLORS, getBoardColorClass } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Loader2, Check } from "lucide-react"
import { createBoard } from "@/app/(app)/home/actions"

interface CreateBoardSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBoardSheet({ open, onOpenChange }: CreateBoardSheetProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [color, setColor] = useState("indigo")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setError("")
    setLoading(true)

    const formData = new FormData()
    formData.append("title", title.trim())
    formData.append("color", color)

    const result = await createBoard(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setLoading(false)
    setTitle("")
    setColor("indigo")
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Create Board</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground">
              Board Name
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter board name"
              className="mt-2 h-12"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Color
            </label>
            <div className="mt-3 flex gap-3">
              {BOARD_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={cn(
                    "relative h-10 w-10 rounded-full transition-transform",
                    getBoardColorClass(c.value),
                    color === c.value && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  )}
                >
                  {color === c.value && (
                    <Check className="absolute inset-0 m-auto h-5 w-5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="h-14 text-base font-semibold"
            disabled={loading || !title.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Board"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
