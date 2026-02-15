import {
  Facebook,
  Instagram,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Image from "./Image";
import { useUser } from "@clerk/clerk-react";

import { useState } from "react";
import Actions from "./Actions";

const PostActions = ({ post }) => {
  const { user } = useUser();

  const [search,setSearch] = useState("")
  const navigate = useNavigate();


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
      <Actions post={post}/>
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
