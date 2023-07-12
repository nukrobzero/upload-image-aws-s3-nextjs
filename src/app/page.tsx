"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const handelUpload = async (files: any) => {
    if (files.length === 0) return;
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("uploadImage", file);

      const res = await fetch(`http://localhost:3000/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImage(data.url);
        setImageName(data.filename);
      } else {
        setImage("");
        setImageName("");
      }
    } catch (error) {
      return;
    }
  };

  const handelDelete = async () => {
    try {
      const formData = new FormData();
      formData.append("DeleteImage", imageName);
      const res = await fetch(`http://localhost:3000/api/upload`, {
        method: "DELETE",
        body: formData,
      });
      if (res.ok) {
        setImage("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-10 bg-gray-900">
      <input
        type="file"
        onChange={(e) => handelUpload(e.target.files)}
        className="pt-6"
        required
      />
      {image && (
        <div className="flex flex-col justify-center items-center space-y-4">
          <Image
            src={image}
            width={600}
            height={600}
            alt="uploadimg"
            layout="responsive"
            style={{ objectFit: "scale-down" }}
            className="!w-[400px] !h-[400px] border rounded-sm"
          />
          <button
            type="button"
            onClick={handelDelete}
            className="p-4 bg-blue-700 hover:bg-blue-500 rounded-md"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
