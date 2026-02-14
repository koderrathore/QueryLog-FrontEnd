import { Search } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Categories = () => {
  const [search, setSearch] = useState();
  const navigate = useNavigate();
  return (
    <div className="hidden md:flex flex-wrap bg-white rounded-3xl lg:rounded-full gap-2 justify-between lg:justify-around items-center px-4 py-4 text-gray-600 font-medium">
      <Link className="cursor-pointer bg-blue-700 text-white rounded-full px-2 py-1 ">
        All Posts
      </Link>
      <Link to={"/posts?category=web-design"} className="cursor-pointer">
        Web Design
      </Link>
      <Link to={"/posts?category=development"} className="cursor-pointer">
        Development
      </Link>
      <Link to={"/posts?category=search-engines"} className="cursor-pointer">
        Search Engines
      </Link>
      <Link to={"/posts?category=marketing"} className="cursor-pointer">
        Marketing
      </Link>
      <Link to={"/posts?category=databases"} className="cursor-pointer">
        Database
      </Link>
      <span className="text-2xl">|</span>
      <div className="flex  items-center bg-slate-200 rounded-full px-2 py-1 ">
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
      </div>
    </div>
  );
};

export default Categories;
