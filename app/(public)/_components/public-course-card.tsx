import { PublicCoursesType } from "@/app/data/admin/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: PublicCoursesType[0];
}
export function PublicCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.fileKey);
  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{data.level}</Badge>
      <Image
        height={400}
        width={600}
        className="w-full rounded-t-xl aspect-video h-full object-cover"
        src={thumbnailUrl}
        alt="Thumbnail image of the course"
      />
      <CardContent className="p-4">
        <Link href={`/courses/${data.slug}`} className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors">
        {data.title}
        </Link>
      </CardContent>
    </Card>
  );
}
