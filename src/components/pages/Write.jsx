import { useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import UploadImage from "../UploadImage";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Write = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [contentImageFile, setContentImageFile] = useState(null);
  const [contentImage, setContentImage] = useState(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!coverImage || !contentImage)
      return toast.error("Please upload the images");
    if (title.trim().length < 4)
      return toast("give atleast 5 characters to title");

    if (!category) return toast("Select Category Please!");
    if (description.trim().length < 4)
      return toast("give atleast 5 characters to title");

    if (title.length > 20)
      return toast("title should be under 20 characters long");
    if (description.length > 50)
      return toast("description should be 50 characters long");
    if (content.length < 100)
      return toast("content should be 100 characters long");
    mutation?.mutate({
      title,
      description,
      content,
      category,
      coverImage,
      contentImage,
    });
  };

  const { getToken } = useAuth();
  const mutation = useMutation({
    mutationFn: async (data) => {
      const token = await getToken();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res.data);
      return res?.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        setTitle("");
        setDescription("");
        setCategory("general");
        setContent("");
        setCoverImage(null);
        setContentImage(null);
        setCoverImageFile(null);
        setContentImageFile(null);
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });
        localStorage.removeItem("coverImage");
        localStorage.removeItem("contentImage");
        toast.success("Published succefully");
        navigate("/");
      } else {
        toast.error(data?.message);
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong!");
    },
  });

  return (
    <div className="flex flex-col my-6 ">
      <span className="md:text-xl font-thin">Create a New Post</span>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-6 mt-4 min-h-[600px]"
      >
        <UploadImage
          coverImageFile={coverImageFile}
          setCoverImageFile={setCoverImageFile}
          contentImageFile={contentImageFile}
          setContentImageFile={setContentImageFile}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          contentImage={contentImage}
          setContentImage={setContentImage}
        />
        <input
          required
          value={title}
          onChange={(e) => setTitle(e?.target?.value)}
          type="text"
          name=""
          id=""
          placeholder="My Awesome Story "
          className="bg-transparent outline-none text-4xl"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="category">Choose category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e?.target?.value)}
            name="category"
            id="category"
            className="w-fit rounded-md "
          >
            <option value="" disabled selected hidden>
              Category
            </option>
            <option value="general">General</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="marketing">Marketing</option>
            <option value="tvShows/movies">TV Shows/Movies</option>
            <option value="search-engines">Search Engines</option>
            <option value="web-design">Web Design</option>
          </select>
        </div>
        <div className="lg:flex gap-4 md:flex-1">
          <div className="flex flex-col lg:w-1/4 ">
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e?.target?.value)}
              type="text"
              placeholder="Add a short description"
              className="lg:min-h-1/2 w-full md:min-h-12 md:max-h-12 lg:min-h-44 min-h-12 rounded-md"
            ></textarea>
            <button
              type="submit"
              className="w-full h-full hidden lg:block text-white bg-blue-600 p-2 rounded-md hover:bg-blue-800"
            >
              Publish
            </button>
          </div>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white rounded-md mt-2 lg:mt-0 flex-1 min-h-72 md:min-h-56 md:max-h-56"
            type="text"
            placeholder="Add your content"
          ></textarea>
        </div>
        <button
          disabled={mutation.isPending}
          type="submit"
          className="lg:hidden text-white bg-blue-600 p-2 w-fit rounded-md hover:bg-blue-800 -mt-4"
        >
          {mutation.isPending ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
};

export default Write;
