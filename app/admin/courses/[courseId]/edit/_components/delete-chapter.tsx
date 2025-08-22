import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteChapter } from "../actions";
import { toast } from "sonner";

export function DeleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  async function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteChapter({
          chapterId,
          courseId,
        })
      );
      if (error) {
        toast.error("An unexpected error occurred");
        return;
      } else if (result.status === "success") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            chapter.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button disabled={pending} onClick={onSubmit}>
            {pending ? <>Deleting...</> : <>Delete</>}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
