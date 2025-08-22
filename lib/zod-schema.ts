import z from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"];
export const courseStatus = ["Draft", "Published", "Archived"];
export const courseCategories = [
  "Development",
  "Business",
  "Finance",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Health & Fitness",
  "Music",
  "Teaching & Academics",
];
export const courseSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be 3 characters long",
    })
    .max(100, {
      message: "Title must be at most 100 characters long",
    }),
  description: z
    .string()
    .min(3, {
      message: "Description must be at least 3 characters long",
    })
    .max(10000),
  fileKey: z.string().min(1, {
    message: "File key is required",
  }),
  price: z.coerce.number().positive().min(1, {
    message: "Price must be at least 1",
  }),
  duration: z.coerce
    .number()
    .positive()
    .min(1, {
      message: "Duration must be at least 1 hour",
    })
    .max(500, {
      message: "Duration must be at most 500 hours",
    }),
  level: z.enum(courseLevels, {
    message: "Level must be one of the predefined values",
  }),
  category: z.enum(courseCategories, {
    message: "Category is required",
  }),
  smallDescription: z
    .string()
    .min(1, {
      message: "Small description is required",
    })
    .max(200, {
      message: "Small description must be at most 200 characters long",
    }),
  slug: z.string().min(3, {
    message: "Slug must be at least 3 characters long",
  }),
  status: z.enum(courseStatus, {
    message: "Status must be one of the predefined values",
  }),
});

export const chapterSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 character long",
  }),
  courseId: z.string().uuid({
    message: "Invalid course id",
  }),
});

export const lessonSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 character long",
  }),
  courseId: z.string().uuid({
    message: "Invalid course id",
  }),
  chapterId: z.string().uuid({
    message: "Invalid chapter id",
  }),
  description: z
    .string()
    .min(3, {
      message: "Description must be at least 3 character long",
    })
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type LessonSchemaType = z.infer<typeof lessonSchema>;
export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
