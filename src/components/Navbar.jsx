import React, { useState } from "react";
import {
  Bookmark,
  Figma,
  LucideSave,
  SaveAll,
  SaveIcon,
  TextAlignJustify,
  X,
} from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div
          className={` items-center text-xl flex justify-around py-4 px-2 absolute top-16 w-full h-12 overflow-hidden transition-all ease-in-out duration-500 left-0 bg-[rgb(179,153,179)] ${menuOpen?"block":"hidden"}`}
    >
      <Link
        to={"/"}
        className="flex gap-1 cursor-pointer items-center overflow-x-hidden"
      >
        <Figma />
        <span className="font-bold text-2xl">QueryBlog</span>
      </Link>
      {/* MOBILE MENU */}

      <div className="md:hidden">
        <div
          className="cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X /> : <TextAlignJustify />}
        </div>
        <div
          className={` items-center text-xl flex justify-around py-4 px-2 absolute top-16 w-full h-12 overflow-hidden transition-all ease-in-out duration-500 left-0 bg-[rgb(179,153,179)] ${menuOpen?"block":"hidden"}`}
        >
          <Link
            to={"/"}
            onClick={() => {
              setMenuOpen((prev) => !prev);
            }}
            className="hover:border-b cursor-pointer font-semibold"
          >
            Home
          </Link>
          <Link
            to={"mailto:rathorekanhaa740@gmail.com"}
            className="hover:border-b cursor-pointer font-semibold"
          >
            Contact
          </Link>
          <Link
            to={"https://www.linkedin.com/in/kunal-rathore-765a1731b"}
            className="hover:border-b cursor-pointer font-semibold"
          >
            About
          </Link>{" "}
          <SignedOut>
            <button
              onClick={() => navigate("/login")}
              className="hover:bg-blue-700 px-4 py-1 rounded-full bg-blue-800 text-white"
            >
              Login
            </button>
          </SignedOut>
          <SignedIn className="flex gap-2">
            <UserButton />
            <Link
              to={"/saved-posts"}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <Bookmark fill="black" className="hover:fill-slate-600" />
            </Link>{" "}
          </SignedIn>
        </div>
      </div>
      {/* DESKTOP MENU */}
      <div className="hidden md:flex flex-1 items-center text-end gap-5 lg:text-xl justify-end">
        <Link
          to={"/"}
          className="hover:border-b cursor-pointer mr-4 font-semibold"
        >
          Home
        </Link>
        <Link
          to={"mailto:rathorekanhaa740@gmail.com"}
          className="hover:border-b cursor-pointer mr-4 font-semibold"
        >
          Contact
        </Link>

        <Link
          to={"https://www.linkedin.com/in/kunal-rathore-765a1731b"}
          className="hover:border-b cursor-pointer mr-4 font-semibold"
        >
          About
        </Link>
        <SignedOut>
          <button
            onClick={() => navigate("/login")}
            className="hover:bg-blue-700 px-4 py-1 rounded-full bg-blue-800 text-white"
          >
            Login
          </button>
        </SignedOut>
        <SignedIn className="flex gap-2">
          <UserButton />
          <Link to={"/saved-posts"}>
            <Bookmark fill="black" className="hover:fill-slate-600" />
          </Link>
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
