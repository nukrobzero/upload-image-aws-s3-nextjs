"use client";

import Image from "next/image";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handelUpload = async (files: FileList | null) => {
    if (files === null) return;
    try {
      setIsLoading(true);
      const originalFile = files[0];
      const fileExtension = originalFile.name.split(".").pop();
      const newFileName = `${uuidv4()}.${fileExtension}`;
      const newFile = new File([originalFile], newFileName, {
        type: originalFile.type,
      });

      const formData = new FormData();
      formData.append("uploadImage", newFile);

      const res = await fetch(`http://localhost:3000/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImage(data.url);
        setImageName(data.filename);
        setIsLoading(false);
      } else {
        setImage("");
        setImageName("");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handelDelete = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("DeleteImage", imageName);
      const res = await fetch(`http://localhost:3000/api/upload`, {
        method: "DELETE",
        body: formData,
      });
      if (res.ok) {
        setImage("");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-10 bg-gray-900">
      {isLoading ? (
        <>Loading...</>
      ) : (
        <input
          type="file"
          onChange={(e) => handelUpload(e.target.files)}
          className="pt-6"
          required
        />
      )}
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
