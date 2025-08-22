import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  AdminCourseCard,
  AdminCourseCardSkeleton,
} from "./_components/admin-course-card";
import { EmptyState } from "@/components/general/empty-state";
import { Suspense } from "react";

export default function CoursesPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants({})} href={"/admin/courses/create"}>
          Create Course
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
        <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
          <RenderCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderCourses() {
  const data = await adminGetCourses();

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Create a new course to get started"
          buttonText="Create Course"
          href="/admin/courses/create"
        />
      ) : (
        <>
          {data.map((course, i) => (
            <AdminCourseCard data={course} key={i} />
          ))}
        </>
      )}
    </>
  );
}

function AdminCourseCardSkeletonLayout() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <AdminCourseCardSkeleton key={i} />
      ))}
    </>
  );
}
