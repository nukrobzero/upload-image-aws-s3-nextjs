"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<string>("");
  const handdelUpload = async (files: any) => {
    const file = files[0];
    const filename = file.name;
    const fileType = file.type;

    const formData = new FormData();
    formData.append("uploadImage", file);

    const res = await fetch(`http://localhost:3000/api/upload`, {
      method: "POST",
      body: formData,
    });

    const { url } = await res.json();
    const upload = await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": fileType },
    });
    if (upload.ok) {
      console.log("Uploaded successfully!");
      const s3FileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
      console.log("File URL", s3FileUrl);
      setImage(s3FileUrl);
    } else {
      console.error("Upload failed.");
    }
  };
  console.log(image);
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-10 bg-gray-900">
      <input type="file" onChange={(e) => handdelUpload(e.target.files)} className="pt-6" />
      {image && (
        <Image
          src={image}
          width={600}
          height={600}
          alt="uploadimg"
          layout="responsive"
          style={{objectFit:"scale-down"}}
          className="!w-[600px] !h-[600px] border rounded-sm"
        />
      )}
    </div>
  );
}
