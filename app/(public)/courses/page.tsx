import { getAllPublicCourses } from "@/app/data/admin/course/get-all-courses";
import { PublicCourseCard } from "../_components/public-course-card";

export default function PublicCourseRoute() {
  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our wide range of courses designed to help you achieve your
          learning goals
        </p>
      </div>
      <RenderCourses/>
    </div>
  );
}

async function RenderCourses() {
  const courses = await getAllPublicCourses();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
      {courses.map((course) => (
        <PublicCourseCard data={course} key={course.id} />
      ))}
    </div>
  );
}
