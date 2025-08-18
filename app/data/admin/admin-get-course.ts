import "server-only";
import { requireAdmin } from "./require-admin";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
export async function adminGetCourse(id: string) {
  await requireAdmin();
  const data = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      chapters: {
        include: {
          lessons: true,
        },
      },
    },
  });
  if (!data) {
    return notFound();
  }

  return data;
}

export type AdminCourseSingularType = Awaited<
  ReturnType<typeof adminGetCourse>
>;
