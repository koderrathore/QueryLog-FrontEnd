import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "./Image";
import { toast } from "react-toastify";
const UploadImage = ({
  coverImageFile,
  coverImage,
  setCoverImageFile,
  setCoverImage,
  contentImageFile,
  contentImage,
  setContentImageFile,
  setContentImage,
}) => {
  const coverImageRef = useRef();
  const contentImageRef = useRef();

  const [coverLoader, setCoverLoader] = useState(false);
  const [contentLoader, setContentLoader] = useState(false);

  const handleCoverImageFileUpload = (e) => {
    setCoverImageFile(e?.target?.files?.[0]);
  };
  const handleContentImageFileUpload = (e) => {
    setContentImageFile(e?.target?.files?.[0]);
  };

  const uploadSingleImage = async (file, type) => {
    const data = new FormData();
    data.append(type, file);

    if (type == "coverImage") {
      setCoverLoader(true);
    }
    if (type == "contentImage") {
      setContentLoader(true);
    }

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/image/upload-image`,
      data,
      { withCredentials: true },
    );

    if (type == "coverImage") {
      setCoverImage(res?.data?.coverImage?.url);
      localStorage.setItem("coverImage", res?.data?.coverImage?.url);
      toast("Cover image Uploaded!")
      setCoverLoader(false);
    }
    if (type == "contentImage") {
      setContentImage(res?.data?.contentImage?.url);
      localStorage.setItem("contentImage", res?.data?.contentImage?.url);
      setContentLoader(false);
      toast("Content image Uploaded!")
    }
  };

  const RemoveCoverImage = () => {
    setCoverImageFile(null);
    setCoverImage(null);
    localStorage.removeItem("coverImage");
          toast("Cover image Removed!")

  };

  const RemoveContentImage = () => {
    setContentImageFile(null);
    setContentImage(null);
    localStorage.removeItem("contentImage");
          toast("Content image Uploaded!")

  };

  useEffect(() => {
    if (coverImageFile) {
      uploadSingleImage(coverImageFile, "coverImage");
    }
  }, [coverImageFile]);

  useEffect(() => {
    if (contentImageFile) {
      uploadSingleImage(contentImageFile, "contentImage");
    }
  }, [contentImageFile]);

  useEffect(() => {
    const cover = localStorage.getItem("coverImage");

    const content = localStorage.getItem("contentImage");

    if (cover) setCoverImage(cover);
    if (content) setContentImage(content);
  }, []);


  return (
    <div className="flex gap-4 items-center">
      <input
        disabled={coverImage !== null}
        onChange={(e) => handleCoverImageFileUpload(e)}
        type="file"
        ref={coverImageRef}
        className="hidden"
      />
      <div
        onClick={() => {
          coverImageRef.current.click();
        }}
        className={`relative min-h-16 p-1 w-1/2 md:h-36 lg:h-60
    rounded-md bg-transparent
    flex justify-center items-center overflow-hidden
    ${coverImage ? "" : "border-2 border-dotted border-black"}`}
      >
        {coverImage && coverImage.length > 0 ? (
          <>
            <Image
              src={coverImage}
              className="w-5/6 rounded-md object-cover lg:rounded-lg"
              w="150"
            />
            <button
              onClick={() => RemoveCoverImage()}
              className="z-50 absolute -top-2 -right-2 flex justify-start md:pl-2 items-center bg-black h-6 w-6 pl-1 md:h-8 md:w-8 lg:h-12 lg:w-12 text-white rounded-full lg:text-2xl lg:-right-3 lg:pl-3 lg:-top-3 "
            >
              {" "}
              x{" "}
            </button>
          </>
        ) : coverLoader ? (
          "Uploading..."
        ) : (
          "Add Cover Image"
        )}
      </div>

      <input
        disabled={contentImage !== null}
        onChange={(e) => handleContentImageFileUpload(e)}
        type="file"
        ref={contentImageRef}
        className="hidden"
      />
      <div
        onClick={() => contentImageRef.current.click()}
        className={`relative min-h-16 p-1 w-1/2 md:h-36 lg:h-60
    rounded-md bg-transparent
    flex justify-center items-center overflow-hidden
    ${contentImage ? "" : "border-2 border-dotted border-black"}`}
      >
        {contentImage && contentImage.length > 0 ? (
          <>
            <Image
              src={contentImage}
              className="w-5/6 rounded-md object-cover lg:rounded-lg"
              w="250"
              h="250"
            />
            <button
              onClick={() => RemoveContentImage()}
              className="z-50 absolute -top-2 -right-2 flex justify-start md:pl-2 items-center bg-black h-6 w-6 pl-1 md:h-8 md:w-8 lg:h-12 lg:w-12 text-white rounded-full lg:text-2xl lg:-right-3 lg:pl-3 lg:-top-3 "
            >
              {" "}
              x{" "}
            </button>
          </>
        ) : contentLoader ? (
          "Uploading..."
        ) : (
          "Add Cover Image"
        )}
      </div>
    </div>
  );
};

export default UploadImage;
