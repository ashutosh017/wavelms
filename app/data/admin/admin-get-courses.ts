import prisma from "@/lib/prisma";
import { requireAdmin } from "./require-admin";

export async function adminGetCourses() {
  await requireAdmin();
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
