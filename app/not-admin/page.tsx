import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto ">
            <ShieldX className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl ">Access Restricted</CardTitle>
          <CardDescription className="max-w-xs mx-auto">
            Hey! You are not an admin, which means you cannot create any course
            or stuff like that...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={"/"} className={buttonVariants({
            class:"w-full"
          })}>
            <ArrowLeft className="mr-1 size-4" />
            <span>Back to home</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
