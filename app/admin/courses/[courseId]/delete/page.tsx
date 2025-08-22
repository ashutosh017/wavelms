'use client'

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteCourse } from "./actions";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function DeleteCoursePage() {
  const params = useParams<{ courseId: string }>();
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const handleDelete = () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteCourse(params.courseId)
      );
      if (error) toast.error("An unexpedted error occured");
      else if (result.status === "success") toast.success(result.message);
      else toast.error(result.message);
      router.push("/admin/courses");
    });
  };
  return (
    <div className="max-w-xl mx-auto w-full ">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course?</CardTitle>
        </CardHeader>
        <CardContent
        className="flex items-center  justify-between">
          <Link
            className={buttonVariants({
              variant: "outline",
            })}
            href={`/admin/courses`}
          >
            Cancel
          </Link>
          <Button
            disabled={pending}
            onClick={handleDelete}
            variant="destructive"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>Delete</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
