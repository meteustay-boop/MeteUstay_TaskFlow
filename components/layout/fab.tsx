"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FABProps {
  onClick: () => void
  className?: string
  icon?: React.ReactNode
}

export function FAB({ onClick, className, icon }: FABProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full shadow-lg",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "transition-transform active:scale-95",
        className
      )}
    >
      {icon || <Plus className="h-6 w-6" />}
    </Button>
  )
}
