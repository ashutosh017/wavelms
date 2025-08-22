import prisma from "@/lib/prisma";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function adminGetLesson(id: string) {
  await requireAdmin();

  const data = await prisma.lesson.findUnique({
    where: {
      id,
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
