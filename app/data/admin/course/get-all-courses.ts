import prisma from "@/lib/prisma";

export async function getAllPublicCourses() {
  const data = await prisma.course.findMany({
    where: {
      status: "Published",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

export type PublicCoursesType = Awaited<ReturnType<typeof getAllPublicCourses>>;
