import React from "react";
import { Bookmark, Star, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Image from "./Image";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Actions = ({ post }) => {
      const { user } = useUser();

  const isAdimn = user?.publicMetadata?.role == "admin" || false;
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const fetchSavedPosts = async () => {
    const token = await getToken();
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/saved-posts`,
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

  console.log(savedPosts)

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
        toast.success(data?.message);
        queryClient.invalidateQueries({
          queryKey: ["savedPosts"],
        });
        queryClient.invalidateQueries({
          queryKey: ["SinglePost", post?._id],
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
          queryKey: ["SinglePost", post?._id],
        });
        toast.success(data?.message || "Featured");
      } else {
        toast.error(data?.message);
      }
    },
  });

  return (
      <div className="flex h-max justify-between md:flex-col md:gap-8 md:mt-8 sticky md:relative">
        <span className="hidden md:block font-semibold lg:text-xl">Actions</span>
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
                  {featurePostsMutation.isPending ? " In Progress..." : ""}
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
            {
              // savePostsMutation.isPending ? (
              //   <Bookmark fill="black" className=" cursor-pointer" />
              // ) :

              savedPosts?.posts &&
              savedPosts?.posts?.some(
                (have) => have?._id?.toString() == post?._id,
              ) ? (
                <>
                  <Bookmark fill="black" className=" cursor-pointer" />
                  <span className="cursor-pointer">
                    Saved{savePostsMutation.isPending ? " In Progress..." : ""}
                  </span>
                </>
              ) : (
                <>
                  <Bookmark className=" cursor-pointer" />
                  <span className="cursor-pointer">
                    Save this post
                    {savePostsMutation.isPending ? " In Progress..." : ""}
                  </span>
                </>
              )
            }
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
  );
};

export default Actions;
