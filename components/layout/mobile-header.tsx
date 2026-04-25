"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface MobileHeaderProps {
  title: string
  showBack?: boolean
  actions?: {
    label: string
    onClick: () => void
    destructive?: boolean
  }[]
  rightElement?: React.ReactNode
  className?: string
}

export function MobileHeader({
  title,
  showBack = false,
  actions,
  rightElement,
  className,
}: MobileHeaderProps) {
  const router = useRouter()

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80 px-4",
        "pt-[env(safe-area-inset-top)]",
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-[48px]">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 -ml-2"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
      </div>

      <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-foreground truncate max-w-[60%]">
        {title}
      </h1>

      <div className="flex items-center gap-1 min-w-[48px] justify-end">
        {rightElement}
        {actions && actions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 -mr-2">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {actions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={action.onClick}
                  className={cn(
                    action.destructive && "text-destructive focus:text-destructive"
                  )}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
