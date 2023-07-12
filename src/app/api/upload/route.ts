import { NextResponse } from "next/server";
import S3 from "aws-sdk/clients/s3";

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

    return NextResponse.json(
      { message: "ok", url: preSignedUrl },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Sometings went wrong!." },
      { status: 500 }
    );
  }
}
