import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { IssueForm } from '@/features/issue-form/components/issue-form'

export function IssueDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report An Issue</DialogTitle>
          <DialogDescription>
            Opens a prefilled issue on GitHub. Nothing is sent from here.
          </DialogDescription>
        </DialogHeader>
        <IssueForm onSubmitted={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
