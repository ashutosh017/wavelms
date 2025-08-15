"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequestPage() {
  const [otp, setOtp] = useState("");
  const [isVerifyRequestPending, startVerifyRequestTransition] =
    useTransition();
  const params = useSearchParams();
  const email = params.get("email") as string;
  const router = useRouter();
  const otpCompleted = otp.length === 6;
  const handleVerifyEmail = () => {
    startVerifyRequestTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified!");
            router.push("/");
          },
          onError: () => {
            toast.error("Error Verifying Email/OTP");
          },
        },
      });
    });
  };
  return (
    <Card className="mx-2 ">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription className="">
          We have sent a verification email code to your email address. Please
          open the email and paste the code below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2 justify-center items-center ">
          <InputOTP
            maxLength={6}
            value={otp}
            className=" "
            onChange={(e) => setOtp(e)}
          >
            <InputOTPGroup className="">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        <Button
          onClick={handleVerifyEmail}
          disabled={isVerifyRequestPending || !otpCompleted}
          className="w-full"
        >
          {isVerifyRequestPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <span>Verify Request</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
