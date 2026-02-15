import {
  SignedIn,
  SignedOut,
  SignUp,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "timeago.js";
const page = 1

const SavedPosts = () => {
  const { userId, getToken } = useAuth();
  const [pageLimit,setPageLimit] = useState(2)
  const navigate = useNavigate();
  const fetchSavedPosts = async (page) => {
    const token = await getToken();
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/saved-posts`,
      {
        params: { page:1, limit: pageLimit},

        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res?.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["allSavedPosts",pageLimit],
    queryFn: () => fetchSavedPosts(page),
    staleTime: "infinity",
  });

  console.log(data)
  const userSavedPosts = data?.posts;

  if (isLoading) return <div>Loading Saved Posts</div>;
  if (error) return <div>Something went wrong</div>;
  return (
    <div className="flex flex-col justify-center items-center pb-4">
      <SignedIn>
        <div className=" flex flex-col flex-wrap md:mt-4 md:flex-row items-center gap-2 md:gap-4">
          {userSavedPosts && userSavedPosts.length > 0
            ? userSavedPosts.map((postContent) => (
                <div
                  key={postContent?._id}
                  className="border-b-2 cursor-pointer pb-4 md:border-none border-red-100 flex flex-col gap-1 md:w-[40vh] lg:w-[79vh] overflow-hidden"
                >
                  <div className="flex gap-1 text-xs lg:text-xl ">
                    <span className="text-gray-500">written by</span>
                    <Link
                      onClick={() =>
                        navigate(`/posts?author=${postContent?.user?.username}`)
                      }
                      className="capitalize hover:text-blue-800 text-blue-600"
                    >
                      {postContent?.user?.username}
                    </Link>
                    <span className="text-gray-500">on</span>
                    <Link
                      onClick={() =>
                        navigate(`/posts?category=${postContent?.category}`)
                      }
                      className="capitalize hover:text-blue-800 text-blue-600"
                    >
                      {postContent?.category}
                    </Link>
                    <span className="text-gray-500">
                      {format(postContent?.createdAt)}
                    </span>
                  </div>
                  <div onClick={() => navigate(`/${postContent?._id}`)}>
                    <div className="md:h-48 lg:h-96 object-cover overflow-hidden rounded-lg">
                      <img
                        src={postContent?.coverImage}
                        className="w-full h-full object-cover flex "
                        alt=""
                      />
                    </div>
                    <div className="flex justify-between my-2 text-xs lg:text-xl">
                      <h1 className="font-medium">{postContent?.title}</h1>
                      <h1 className="font-medium">
                        {postContent?.description}
                      </h1>
                    </div>
                    <h1 className="line-clamp-2 font-medium md:line-clamp-4 text-justify">
                      {postContent?.content}
                    </h1>
                    <span className="text-blue-600 md:text-lg md:mt-2">
                      Read More
                    </span>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </SignedIn>

      <SignedOut>
        <SignUp signInUrl="/login" />
      </SignedOut>
      {userSavedPosts && userSavedPosts.length > 0 ? (
        <button
        disabled={!data?.hasMore}
          onClick={()=>setPageLimit((prev)=>prev+2)}
          className="p-2  disabled:bg-slate-500 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 rounded-xl hover:text-white disabled:hover:text-black"
        >
         {
          data?.hasMore?"Load More":"Saved Data Loaded"
         }
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default SavedPosts;
