"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import UserDropdown from "./user-dropdown";
const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];
export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Image src={Logo} alt="logo" className="size-9 rounded-md" />
          <span className="font-bold">WaveLMS.</span>
        </Link>
        {/**Desktop  */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between ">
          <div className="flex items-center space-x-2">
            {navigationItems.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isPending ? null : session ? (
              <UserDropdown
                name={session.user.name}
                email={session.user.email}
                image={
                  session.user.image ??
                  `https://avatar.vercel.sh/${session?.user.email}`
                }
              />
            ) : (
              <>
                <Link
                  href={"/login"}
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                >
                  Login
                </Link>
                <Link href={"/login"} className={buttonVariants({})}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
