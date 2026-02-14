import { MoveUpRight } from "lucide-react";
import React, { use } from "react";
import Categories from "../Categories";
import FeaturedPosts from "../FeaturedPosts";
import PostList from "./PostList";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const navigate = useNavigate();
  const fetchPosts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
    return res.data;
  };

  const { error, data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(),
  });

  console.log(error);
  console.log(data);
  return (
    <div className="flex flex-col gap-6">
      {/* BREADCRUMS */}
      <div className="flex items-center text-[13px] md:text-xl gap-2 md:gap-4 text-blue-800 mt-2">
        <span className="cursor-pointer">Home</span>
        <span>/</span>
        <span onClick={() => navigate("/posts")} className="cursor-pointer">
          Blogs and Articles
        </span>
        <span className="md:hidden">/</span>
        <span
          onClick={() => navigate("/write")}
          className="cursor-pointer md:hidden"
        >
          Write your Blogs
        </span>
      </div>
      {/* INTRODUCTION */}
      <div className="flex gap-4 items-center md:items-start">
        <div className="flex flex-col gap-2">
          <div className="font-bold text-xl md:text-4xl lg:text-6xl text-gray-800 lg:pr-4">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </div>
          <p className="lg:text-xl">
            {" "}
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
        <div onClick={() => navigate("/write")} className="hidden md:block">
          <div className="rounded-full w-fit p-4 h-fit flex items-center justify-center bg-blue-700 border-2 border-white mt-8 md:mt-0 hover:border-gray-800">
            <MoveUpRight className="w-20 h-20 lg:w-24 lg:h-24" />
          </div>
          <div className="absolute md:top-24 md:right-2 lg:right-24">
            Write your blog
          </div>
        </div>
      </div>
      {/* CATEGORIES  */}
      <Categories />
      
      {/* FEATURED POSTS  */}
      <FeaturedPosts />
      {/* POST LISTS */}
      <div className="text-xl -mt-4 lg:text-2xl text-gray-500">
        Recent Posts
      </div>
      <PostList />
    </div>
  );
};

export default Home;
