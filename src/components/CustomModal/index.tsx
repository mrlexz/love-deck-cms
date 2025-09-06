import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ReusableModalProps {
  triggerText?: string
  triggerClassName?: string
  modalTitle: string
  modalDescription?: string
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
  customTrigger?: React.ReactNode
}

export function CustomModal({
  modalTitle,
  modalDescription,
  children,
  open,
  onOpenChange,
}: ReusableModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          {modalDescription && (
            <DialogDescription>{modalDescription}</DialogDescription>
          )}
        </DialogHeader>
        <div className="py-4 max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}