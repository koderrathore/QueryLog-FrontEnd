import {
  Bookmark,
  Facebook,
  Instagram,
  Search,
  Star,
  Trash,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Image from "./Image";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";

const PostActions = ({ post }) => {
  const { user } = useUser();

  const isAdimn = user?.publicMetadata?.role == "admin" || false;
  const [search,setSearch] = useState("")
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const fetchSavedPosts = async () => {
    const token = await getToken();
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/allPosts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res?.data;
  };

  const {
    data: savedPosts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: fetchSavedPosts,
  });

  console.log(savedPosts);

  const savePostsMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/save`,
        { postId: post?._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onError: (error) => {
      toast.error(error);
      console.log(error);
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.success) {
        toast.success(data?.message || "Post saved");
        queryClient.invalidateQueries({
          queryKey: ["savedPosts"],
        });
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    },
  });
  const deletePostsMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    },
    onError: (error) => {
      toast.error(error);
      console.log(error);
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.success) {
        toast.success(data?.message || "Post Deleted");
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });
        navigate("/");
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    },
  });

  const featurePostsMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/featured`,
        { id: post?._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res?.data;
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something Went Wrong!");
    },
    onSuccess: (data) => {
      console.log("Featured ", data);
      if (data?.success) {
        queryClient.invalidateQueries({
          queryKey: ["SinglePost"],
        });
        toast.success(data?.message || "Featured");
      } else {
        toast.error(data?.message);
      }
    },
  });

  console.log(post);

  return (
    <div className="sticky top-2 hidden md:flex md:flex-col min-h-max md:min-w-44 lg:min-w-60 pl-8 lg:pl-16 gap-2">
      <span className="font-semibold lg:text-xl">Author</span>
      <div className="flex flex-col gap-8">
        <div className="flex gap-6 items-center">
          <Image
            w="48"
            className="w-12 h-12 rounded-full cursor-pointer"
            src={user?.imageUrl}
          />
          <Link className="text-blue-600 cursor-pointer md:text-xl">
            {user?.username}
          </Link>
        </div>
        <p className="text-xs text-gray-500">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </p>
        <div className="flex gap-8">
          <Facebook className="cursor-pointer" />
          <Instagram className="cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-col md:gap-8 mt-8">
        <span className="font-semibold lg:text-xl">Actions</span>
        {isAdimn ? (
          <div
            onClick={() => {
              user && user?.id && isAdimn
                ? featurePostsMutation.isPending
                  ? null
                  : featurePostsMutation.mutate()
                : null;
            }}
            className=" flex gap-2 hover:text-blue-600"
          >
            {featurePostsMutation.isPending ? (
              <Star fill="black" className=" cursor-pointer" />
            ) : post?.isFeatured ? (
              <>
                <Star fill="black" className=" cursor-pointer" />
                <span className="cursor-pointer">
                  Featured
                  {featurePostsMutation.isPending ? "In Progress..." : ""}
                </span>
              </>
            ) : (
              <>
                <Star className=" cursor-pointer" />
                <span className="cursor-pointer">
                  Feature
                  {featurePostsMutation.isPending ? "In Progress..." : ""}
                </span>
              </>
            )}
            <span className="cursor-pointer">
              {featurePostsMutation.isPending ? "In Progress..." : ""}
            </span>
          </div>
        ) : (
          <div
            onClick={() => {
              user && user?.id
                ? savePostsMutation.isPending
                  ? null
                  : savePostsMutation.mutate()
                : navigate("/login");
            }}
            className=" flex gap-2 hover:text-blue-600"
          >
            {savePostsMutation.isPending ? (
              <Bookmark fill="black" className=" cursor-pointer" />
            ) : savedPosts &&
              savedPosts?.posts?.some(
                (have) => have.toString() === post?._id,
              ) ? (
              <>
                <Bookmark fill="black" className=" cursor-pointer" />
                <span className="cursor-pointer">
                  Saved{savePostsMutation.isPending ? "In Progress..." : ""}
                </span>
              </>
            ) : (
              <>
                <Bookmark className=" cursor-pointer" />
                <span className="cursor-pointer">
                  Save this post
                  {savePostsMutation.isPending ? "In Progress..." : ""}
                </span>
              </>
            )}
            <span className="cursor-pointer">
              {savePostsMutation.isPending ? "In Progress..." : ""}
            </span>
          </div>
        )}
        {user &&
        ((user?.id && post?.user?.username === user?.username) || isAdimn) ? (
          <div
            onClick={() =>
              deletePostsMutation?.isPending
                ? null
                : deletePostsMutation.mutate()
            }
            className="flex gap-2 hover:text-red-400 text-red-600"
          >
            <Trash className="cursor-pointer" />
            <span className="cursor-pointer">
              {deletePostsMutation?.isPending
                ? "In Progress..."
                : "Delete this post"}
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 mt-6">
        <span className="font-semibold mb-2 lg:text-xl">Categories</span>

        <Link
        to={"/posts"}
        className="cursor-pointer underline hover:text-blue-600">
          All
        </Link>
        <Link to={"/posts?category=web-design"} className="cursor-pointer underline hover:text-blue-600">
          Web Design
        </Link>
        <Link
          to={"/posts?category=tvShows/movies"}
          className="cursor-pointer underline hover:text-blue-600"
        >
          TV/Movies
        </Link>
        <Link to={"/posts?category=development"} className="cursor-pointer underline hover:text-blue-600">
          Development
        </Link>
        <Link to={"/posts?category=databases"} className="cursor-pointer underline hover:text-blue-600">
          Databases
        </Link>
        <Link to={"/posts?category=search-engines"} className="cursor-pointer underline hover:text-blue-600">
          Search Engines
        </Link>
        <Link to={"/posts?category=marketing"} className="cursor-pointer underline hover:text-blue-600">
          Marketing
        </Link>
      </div>
      <div className=" mt-4 flex  items-center bg-slate-200 rounded-full px-2 py-1 gap-2 ">
        <Search />
        <input
          type="text"
          placeholder="search a post"
          value={search}
          className="placeholder:px-2 outline-none bg-slate-200"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e?.key === "Enter") {
              e.preventDefault();
              navigate(`/posts?search=${search}`);
            }
          }}
        />
      </div>{" "}
    </div>
  );
};

export default PostActions;
