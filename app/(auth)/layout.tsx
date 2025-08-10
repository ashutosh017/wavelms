import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col justify-center items-center min-h-svh ">
      <Link
        href={"/"}
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <div className="flex max-w-sm w-full flex-col gap-6">
        <Link
          className="flex items-center gap-2 self-center font-medium"
          href={"/"}
        >
          <Image
            className="rounded-md"
            src={"/logo.png"}
            alt="Logo"
            width={32}
            height={32}
          />
          WaveLMS.
        </Link>

        {children}
        <div className="text-balance text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <span className="hover:text-primary hover:underline">
            Terms of service
          </span>{" "}
          and <span  className="hover:text-primary hover:underline">Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}
