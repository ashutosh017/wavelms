"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/lib/type";
import { courseSchema, CourseSchemaType } from "@/lib/zod-schema";
import { request } from "@arcjet/next";
const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );
export async function CreateCourse(
  data: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });
    if (decision.isDenied())
      if (decision.reason.isRateLimit())
        return {
          status: "error",
          message: "You have been blocked due to rate limit",
        };
      else
        return {
          status: "error",
          message: "You are a bot! if this is a mistake contact our support",
        };

    const validation = courseSchema.safeParse(data);

    if (!validation.success)
      return {
        status: "error",
        message: "Invalid Form Data",
      };

    await prisma.course.create({
      data: {
        ...validation.data,
        level: undefined,
        status: undefined,
        updatedAt: new Date(),
        userId: session?.user.id as string,
      },
    });
    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed course creation",
    };
  }
}
