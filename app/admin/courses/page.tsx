import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <>
    
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Your Courses</h1>
      <Link className={buttonVariants({})} href={"/admin/courses/create"}>Create Course</Link>
    </div>
    <div>
        <h1>Here you will see all of the courses</h1>
    </div>
    </>
  );
}
