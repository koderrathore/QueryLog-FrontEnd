import React from "react";
import { Link, useParams } from "react-router-dom";
import Image from "../Image";
import { Bookmark, Facebook, Instagram, Search, Trash } from "lucide-react";
import Comments from "../Comments";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "timeago.js";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import PostActions from "../PostActions";
import Actions from "../Actions";

const SinglePost = () => {
  const [comment, setComment] = useState("");
  const { postId } = useParams();
  const { userId, getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const fetchPost = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/posts/${postId}`,
    );
    return res.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["SinglePost", postId],
    queryFn: fetchPost,
    staleTime: 5 * 1000,
  });

  const handleAddComments = (e) => {
    e.preventDefault();
    console.log(comment);
    console.log(userId);
    mutation?.mutate({
      comment,
    });
  };

  const mutation = useMutation({
    mutationFn: async (comment) => {
      const token = await getToken();

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        comment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res);
      console.log(res?.data);
      return res.data;
    },
    onError: (error) => {
      console.log(error);
      toast.error(error || "Something went wrong!");
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.success) {
        setComment("");
        toast.success(data.message || "Comment Added");

        queryClient.invalidateQueries({
          queryKey: ["Comments", postId],
        });
      } else {
        toast.error(data.message);
      }
    },
  });
  if (isLoading) return <div>loading...</div>;
  if (!data?.post) return <div>Something went wrond!</div>;
  return (
    <div className="items-start flex relative h-max">
      <div className="flex flex-col gap-4 lg:gap-8 py-4">
        <div className="md:hidden">
          <Actions post={data?.post}/>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="flex flex-col gap-4 w-full">
            <div className="md:text-xl font-semibold lg:text-4xl">
              {data?.post?.title}
            </div>
            <div className="flex gap-1 text-xs md:text-[11px] lg:text-xl">
              <span className="text-gray-500">written by</span>
              <Link
                to={`/posts?author=${data?.post?.user?.username}`}
                className="text-blue-600"
              >
                {data?.post?.user?.username}
              </Link>
              <span className="text-gray-500">on</span>
              <Link
                to={`/posts?category=${data?.post?.category}`}
                className="text-blue-600"
              >
                {data?.post?.category}
              </Link>
              <span className="text-gray-500">
                {" "}
                {format(data?.post?.createdAt)}
              </span>
            </div>
            <p className="lg:text-2xl text-gray-500 ">
              {data?.post?.description}
            </p>
            <p className="lg:text-2xl text-gray-500 line-clamp-1 md:line-clamp-2 lg:line-clamp-3">
              {data?.post?.content}
            </p>
          </div>
          <div className="-mt-6 md:mt-0 md:w-3/4  lg:block overflow-hidden">
            <Image
              src={data?.post?.coverImage}
              className="w-full rounded-3xl object-cover"
              w="767"
            />{" "}
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex flex-col gap-8">
            <p className="text-[12px] md:text-[14px] lg:text-xl font-medium text-justify">
              {data?.post?.content}
            </p>
            <Image
              w="767"
              className="rounded-2xl w-full object-cover"
              src={data?.post?.contentImage}
            />
          </div>
        </div>
        {/* COMMENTS */}
        <div className="text-xl lg:text-2xl text-gray-500">Comments</div>
        {userId && isSignedIn ? (
          <form onSubmit={(e) => handleAddComments(e)} className="flex gap-6 ">
            <input
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              type="text"
              placeholder="Write a comment..."
              className="w-full md:h-12 lg:h-16 rounded-md placeholder:pl-2"
            />
            <button
              disabled={comment.length < 4 || mutation?.isLoading}
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg disabled:bg-blue-400/75 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        ) : null}
        <Comments postId={data?.post?._id} />
      </div>

      <PostActions post={data?.post} />
    </div>
  );
};

export default SinglePost;
