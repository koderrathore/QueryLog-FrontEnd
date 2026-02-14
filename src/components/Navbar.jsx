import React, { useState } from "react";
import { Figma, TextAlignJustify, X } from "lucide-react";
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
    <div className={`flex justify-between items-center py-4 border-b h-16 ${menuOpen ? "overflow-hidden max-h-dvh" : ""}`}>
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
          className={`text-2xl flex flex-col items-center justify-center pb-32 gap-6 absolute top-16 w-full h-screen overflow-x-hidden transition-all ease-in-out duration-200 ${menuOpen ? "-right-0 z-50  bg-[rgb(219_197_219)] max-h-dvh overflow-hidden" : "-right-[100%]"}`}
        >
          <Link to={"/"} className="hover:border-b cursor-pointer">
            Home
          </Link>
          <Link className="hover:border-b cursor-pointer">Trending</Link>
          <Link className="hover:border-b cursor-pointer">Most Popular</Link>
          <Link className="hover:border-b cursor-pointer">About</Link>
          <SignedOut>
            <button
              onClick={() => navigate("/login")}
              className="hover:bg-blue-700 px-4 py-1 rounded-full bg-blue-800 text-white"
            >
              Login
            </button>
          </SignedOut>
          <SignedIn>
            <UserButton />
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
        <Link className="hover:border-b cursor-pointer mr-4 font-semibold">
          Trending
        </Link>
        <Link className="hover:border-b cursor-pointer mr-4 font-semibold">
          Most Popular
        </Link>
        <Link className="hover:border-b cursor-pointer mr-4 font-semibold">
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
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
