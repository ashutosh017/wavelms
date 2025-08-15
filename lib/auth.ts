import "server-only"

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { env } from "./env";
import prisma from "./prisma";
import { resend } from "./resend";

// console.log("env: ",env.GITHUB_CLIENT_SECRET);
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Implement the sendVerificationOTP method to send the OTP to the user's email address
        await resend.emails.send({
          from: "WaveLMS <onboarding@resend.dev>",
          to: [email],
          subject: "WaveLMS - Verify your email",
          html: `<p>Your OTP is <strong>${otp}</strong> </p>`,
        });
      },
    }),
  ],
});
