"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
export default function LoginForm() {
  const [isGithubPending, startGithubTransition] = useTransition();
  const [isEmailPending, startEmailTransition] = useTransition();
  const router = useRouter();
  const [email, setEmail] = useState("");
  async function handleSignInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Github, you will be redirected...");
          },
          onError: () => {
            toast.error("Internal server error");
          },
        },
      });
    });
  }
  function handleSigninWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email sent");
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("Error sending email");
          },
        },
      });
    });
  }
  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>Welcome Back! </CardTitle>
        <CardDescription> Login with your Github Email Account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          onClick={handleSignInWithGithub}
          className="w-full "
          variant={"outline"}
          disabled={isGithubPending}
        >
          {isGithubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <FaGithub />
              Sign in with Github
            </>
          )}
        </Button>
        <div className="relative text-center text-small after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground text-sm">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="me@example.com"
              required
            />
          </div>
          <Button onClick={handleSigninWithEmail} disabled={isEmailPending}>
            {isEmailPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Continue with Email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
