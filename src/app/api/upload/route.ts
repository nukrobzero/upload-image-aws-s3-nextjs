import { NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(request: Request) {
  try {
    const getFile = await request.formData();
    const file = getFile.get("uploadImage") as File;

    const fileName = file.name;
    const fileType = file.type;

    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: `${process.env.ACCESS_KEY}`,
        secretAccessKey: `${process.env.SECRET_KEY}`,
      },
    });

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });
    const preSignedUrl = await getSignedUrl(client, command, {
      expiresIn: 5 * 60,
    });

    const upload = await fetch(preSignedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": fileType },
    });
    if (upload.ok) {
      const s3FileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      return NextResponse.json(
        { message: "ok", url: s3FileUrl, filename: fileName },
        { status: 201 }
      );
    } else {
      console.error("Upload failed.");
      return NextResponse.json({ error: "Upload failed." }, { status: 402 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Sometings went wrong!." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const getFile = await request.formData();
    const fileName = getFile.get("DeleteImage") as string;
    const bucket = process.env.BUCKET_NAME as string;
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: `${process.env.ACCESS_KEY}`,
        secretAccessKey: `${process.env.SECRET_KEY}`,
      },
    });

    const command = new DeleteObjectCommand({ Bucket: bucket, Key: fileName });
    await client.send(command);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
