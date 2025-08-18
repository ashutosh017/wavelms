import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { AdminCourseCard } from "./_components/admin-course-card";

export default async function CoursesPage() {
  const data = await adminGetCourses();
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants({})} href={"/admin/courses/create"}>
          Create Course
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
        {data.map((course, i) => (
          <AdminCourseCard data={course} key={i} />
        ))}
      </div>
    </>
  );
}
