import React from "react";
import Image from "./Image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { format } from "timeago.js";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";

const Comments = ({ postId }) => {
  const { userId } = useAuth();
  const {user} = useUser()
  const isAdimn = user?.publicMetadata?.role == "admin" || false;
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [showFullComment, setShowFullComment] = useState(null);
  const fetchComments = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/comments/${postId}`,
    );
    return res.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["Comments", postId],
    queryFn: fetchComments,
    staleTime: Infinity,
  });

  queryClient.invalidateQueries({
    queryKey: ["Comments", postId],
  });

  const deleteComments = (id) => {
    console.log(id);
    mutation?.mutate(id);
  };

  const mutation = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res?.data);
      return res?.data;
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong!");
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.success) {
        toast.success(data?.message || "deleted");
        queryClient.invalidateQueries({
          queryKey: ["Comments", postId],
        });
      }
    },
  });

  if (isLoading) return <div>loading...</div>;
  if (!data) return <div>Something went wrond!</div>;
  return (
    <div className="">
      {data?.comments && data?.comments?.length > 0 ? (
        data?.comments?.map((comment) => (
          <div
            key={comment?._id}
            className="relative rounded-md px-4 py-2 flex-col lg:py-6 bg-white my-2"
          >
            <div className="flex gap-4 text-sm items-center lg:text-xl">
              <Image
                w="48"
                className="w-8 h-8 rounded-full object-cover"
                src={
                  comment?.user?.img ||
                  "https://imgs.search.brave.com/OrvFL2AD85Wyt_GL_x3kyCCYdVUybANnlgtKHDXaLiM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzE0LzQz/LzU1LzE0NDM1NWQ3/YjM2YzVmNjQ2NDM1/NDIzNzk4MjgxY2U5/LmpwZw"
                }
              />
              <span className="">{comment?.user?.username}</span>
              <span className="">{format(comment?.createdAt)}</span>
            </div>
            <p
              onClick={() => {
                setShowFullComment(() =>
                  !showFullComment ? comment?._id : null,
                );
              }}
              className={`${showFullComment == comment?._id ? "line-clamp-none" : "line-clamp-3"} mt-2 lg:mt-4 text-[12px] lg:text-[18px] font-medium`}
            >
              {comment?.description}
            </p>
            {userId && (comment?.clerkId == userId || isAdimn) ? (
              <Trash
                onClick={() => deleteComments(comment?._id)}
                className="w-5 absolute top-0 right-0 md:w-auto md:top-1 md:right-1 text-red-600"
              />
            ) : null}
          </div>
        ))
      ) : (
        <div>No comments on this post yet!</div>
      )}
    </div>
  );
};

export default Comments;
