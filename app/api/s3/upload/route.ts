import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/s3-client";

const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});

export  async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = fileUploadSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Invalid Request Body",
      },
      {
        status: 400,
      }
    );
  }
  try {
    const { fileName, contentType, size } = validation.data;
    const uniqueKey = `${uuid()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
    });

    const preSignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
    });
    const response = {
      preSignedUrl:preSignedUrl,
      key: uniqueKey,
    };
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed generating pre signed url",
      },
      {
        status: 500,
      }
    );
  }
}
