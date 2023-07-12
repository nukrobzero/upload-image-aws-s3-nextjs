import { NextResponse } from "next/server";
import S3 from "aws-sdk/clients/s3";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const getFile = await request.formData();
    const file = getFile.get("uploadImage") as string;
    //@ts-ignore
    const fileName = file.name;
    //@ts-ignore
    const fileType = file.type;

    const s3 = new S3({
      signatureVersion: "v4",
      region: process.env.AWS_REGION,
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    });

    const preSignedUrl = await s3.getSignedUrl("putObject", {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
      Expires: 5 * 60,
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

    const s3 = new S3({
      signatureVersion: "v4",
      region: process.env.AWS_REGION,
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
    });

    await s3.deleteObject({ Bucket: bucket, Key: fileName }).promise();

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
