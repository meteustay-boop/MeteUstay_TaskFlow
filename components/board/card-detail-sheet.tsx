"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Trash2, Loader2 } from "lucide-react"
import { updateCard, deleteCard } from "@/app/(app)/board/[id]/actions"

interface CardDetailSheetProps {
  card: Card | null
  boardId: string
  onClose: () => void
}

export function CardDetailSheet({ card, boardId, onClose }: CardDetailSheetProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (card) {
      setTitle(card.title)
      setDescription(card.description || "")
    }
  }, [card])

  async function handleSave() {
    if (!card || !title.trim()) return

    setIsSaving(true)
    await updateCard(
      card.id,
      {
        title: title.trim(),
        description: description.trim(),
      },
      boardId
    )
    setIsSaving(false)
    router.refresh()
    onClose()
  }

  async function handleDelete() {
    if (!card) return
    if (!confirm("Delete this card?")) return

    setIsDeleting(true)
    await deleteCard(card.id, boardId)
    setIsDeleting(false)
    router.refresh()
    onClose()
  }

  return (
    <Sheet open={!!card} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Edit Card</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          <div>
            <label className="text-sm font-medium text-foreground">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Card title"
              className="mt-2 h-12"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              className="mt-2 min-h-[120px] resize-none"
            />
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <Button
              onClick={handleSave}
              className="h-14 text-base font-semibold"
              disabled={isSaving || !title.trim()}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleDelete}
              className="h-14 text-base text-destructive hover:text-destructive"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-5 w-5" />
                  Delete Card
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
