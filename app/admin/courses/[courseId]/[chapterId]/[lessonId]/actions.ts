"use server";

import prisma from "@/lib/prisma";
import { ApiResponse } from "@/lib/type";
import { lessonSchema, LessonSchemaType } from "@/lib/zod-schema";

export async function updateLesson(
  values: LessonSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  try {
    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }
    const { name, description, thumbnailKey, videoKey } = result.data;
    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: name,
        description,
        videoKey,
        thumbnailKey,
      },
    });

    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
}
