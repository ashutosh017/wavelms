import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { chapterSchema, ChapterSchemaType } from "@/lib/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createChapter } from "../actions";
import { toast } from "sonner";

export function NewChapterModal({ courseId }: { courseId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  function handleOpenChange(open: boolean) {
    if (!open) form.reset();
    setIsOpen(open);
  }
  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: "",
      courseId,
    },
  });
  const [pending, startTransition] = useTransition();
  async function onSubmit(values: ChapterSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createChapter(values));
      if (error) {
        toast.error("An unexpected error occurred");
        return;
      } else if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2" variant={"outline"} size={"sm"}>
          <Plus className="size-4" /> New Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            What would you like to name your chapter?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chapter Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={pending} type="submit">
                {pending ? (
                  <>
                    <span>Saving...</span>
                    <Loader2 className="size-4 ml-2" />
                  </>
                ) : (
                  <>Save Change</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
