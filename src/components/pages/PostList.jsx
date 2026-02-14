import React, { useState } from "react";
import Image from "../Image";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { format } from "timeago.js";
import { useEffect } from "react";

const PostList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState();
  const [selectedFilter, setSelectedFilter] = useState(null);

  const fetchPosts = async (pageParam, searchParams) => {
    const searchObj = Object.fromEntries([...searchParams]);

    console.log(searchObj.sort);

    if (searchObj.sort) {
      setSelectedFilter(searchObj.sort);
    } else {
      setSelectedFilter(null);
    }

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
      params: { page: pageParam, limit: 5, ...searchObj },
    });
    return res.data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams?.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage?.hasMore ? pages?.length + 1 : undefined,
  });

  if (status === "pending") return <div>Loading...</div>;
  if (error) return <div>Something went wrong</div>;

  console.log(error);
  console.log(data?.pages?.posts);

  const allPosts = data?.pages?.flatMap((page) =>
    page?.posts?.length > 0 ? page?.posts : [],
  );

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(search);
    setSearchParams({ ...Object.fromEntries(searchParams), search: search });
  };

  return (
    <div className="flex gap-6 md:gap-4 lg:gap-8 pb-4">
      <div className="flex flex-col gap-2 md:gap-4 lg:gap-8">
        {allPosts && allPosts?.length > 0 ? (
          location?.pathname === "/posts" ? (
            <div className="md:hidden flex flex-col my-2">
              <button
                onClick={() => setFiltersOpen((prev) => !prev)}
                className="bg-blue-800 w-fit p-2 rounded-lg text-white"
              >
                {filtersOpen ? "Close" : "Filters or Search"}{" "}
              </button>
              {filtersOpen ? (
                <div className="flex flex-col">
                  <div className="flex flex-col gap-4 mb-4 lg:mb-6">
                    <span className=" font-semibold mt-2 text-xl">Search</span>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value.trim())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearch(e);
                        }
                      }}
                      className="p-1 rounded-md"
                    />
                  </div>
                  <span className="text-xl font-semibold mb-4">Filters</span>
                  <div className="flex flex-col gap-2 mb-4 lg:mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilter === "newest"}
                        onChange={() => {
                          setSelectedFilter(
                            selectedFilter === "newest" ? null : "newest",
                          );
                          setSearchParams({
                            ...Object.fromEntries(searchParams),
                            sort: "newest",
                          });
                        }}
                        className="w-4 h-4 appearance-none border-2 bg-white border-blue-600 checked:bg-blue-600"
                      />
                      Newest
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilter === "popular"}
                        onChange={() => {
                          setSelectedFilter(
                            selectedFilter === "popular" ? null : "popular",
                          );
                          setSearchParams({
                            ...Object.fromEntries(searchParams),
                            sort: "popular",
                          });
                        }}
                        className="w-4 h-4 appearance-none border-2 bg-white border-blue-600 checked:bg-blue-600"
                      />
                      Most Popular
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilter === "oldest"}
                        onChange={() => {
                          setSelectedFilter(
                            selectedFilter === "oldest" ? null : "oldest",
                          );
                          setSearchParams({
                            ...Object.fromEntries(searchParams),
                            sort: "oldest",
                          });
                        }}
                        className="w-4 h-4 appearance-none border-2 bg-white border-blue-600 checked:bg-blue-600"
                      />
                      Oldest
                    </label>
                  </div>
                  <span className="text-xl font-semibold mb-4">Categories</span>
                  <div className="flex flex-col gap-2">
                    <Link
                      to={"/posts?category=general"}
                      className="cursor-pointer underline hover:text-blue-600"
                    >
                      General
                    </Link>
                    <Link
                      to={"/posts?category=webDesign"}
                      className="cursor-pointer underline hover:text-blue-600"
                    >
                      Web Design
                    </Link>
                    <Link
                      to={"/posts?category=tvShows/movies"}
                      className="cursor-pointer underline hover:text-blue-600"
                    >
                      TV/Movies
                    </Link>
                    <Link
                      to={"/posts?category=development"}
                      className="cursor-pointer underline hover:text-blue-600"
                    >
                      Development
                    </Link>
                    <Link
                      to={"/posts?category=databases"}
                      className="cursor-pointer underline hover:text-blue-600"
                    >
                      Databases
                    </Link>
                    <Link
                      to={"/posts?category=search-engines"}
                      className="cursor-pointer underline hover:text-blue-600"
                    >
                      Search Engines
                    </Link>
                    <Link
                      to={"/posts?category=marketing"}
                      className="cursor-pointer underline hover:text-blue-600"
                    >
                      Marketing
                    </Link>
                  </div>
                  <button type="submit" className="hidden"></button>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )
        ) : (
          ""
        )}

        {allPosts && allPosts?.length > 0 ? (
          <InfiniteScroll
            dataLength={allPosts?.length} //This is important field to render the next data
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>All Posts Loaded!</b>
              </p>
            }
          >
            {allPosts && allPosts?.length > 0 ? (
              allPosts?.map((postContent) => (
                <div
                  key={postContent?._id}
                  className=" my-1 items-center justify-center cursor-pointer flex flex-col lg:flex-row gap-2 md:gap-2 lg:gap-16 py-4 border-b-2 md:border-b-0"
                >
                  <div className="md:hidden lg:block overflow-hidden flex w-full h-44 rounded-3xl lg:min-w-96 lg:min-h-56">
                    <Image
                      src={postContent?.coverImage}
                      className=" w-full object-fill flex rounded-3xl md:hidden lg:block"
                      w="767"
                    />
                  </div>
                  <div className="flex flex-col gap-2 lg:gap-4 text-justify">
                    <div className="text-xl line-clamp-2 md:text-2xl lg:text-4xl font-semibold">
                      {postContent?.title}
                    </div>
                    <div className="flex gap-1 text-xs lg:text-xl ">
                      <span className="text-gray-500">written by</span>
                      <Link
                        onClick={() =>
                          navigate(
                            `/posts?author=${postContent?.user?.username}`,
                          )
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
                    <p
                      onClick={() => navigate(`/${postContent?._id}`)}
                      className="lg:text-xl line-clamp-4"
                    >
                      {postContent?.content}
                    </p>
                    <Link
                      onClick={() => navigate(`/${postContent?._id}`)}
                      className="hover:text-blue-800 text-blue-600 lg:text-xl "
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div>No Posts yet!</div>
            )}
          </InfiniteScroll>
        ) : (
          ""
        )}
      </div>

      {allPosts && allPosts?.length > 0 ? (
        location.pathname === "/posts" ? (
          <div className="sticky h-max top-6  md:flex md:flex-col lg:min-w-60 pl-4 lg:pl-8 gap-4 hidden">
            <div className="flex flex-col gap-4 mb-4 lg:mb-6">
              <span className=" font-semibold text-xl">Search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
                className="p-1 rounded-md"
              />{" "}
            </div>
            <span className="text-xl font-semibold">Filters</span>
            <div className="flex flex-col gap-2 mb-4 lg:mb-6">
              <div className="flex flex-col gap-2 mb-4 lg:mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilter === "newest"}
                    onChange={() => {
                      setSelectedFilter(
                        selectedFilter === "newest" ? null : "newest",
                      );
                      setSearchParams({
                        ...Object.fromEntries(searchParams),
                        sort: "newest",
                      });
                    }}
                    className="w-4 h-4 appearance-none border-2 bg-white border-blue-600 checked:bg-blue-600"
                  />
                  Newest
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilter === "popular"}
                    onChange={() => {
                      setSelectedFilter(
                        selectedFilter === "popular" ? null : "popular",
                      );
                      setSearchParams({
                        ...Object.fromEntries(searchParams),
                        sort: "popular",
                      });
                    }}
                    className="w-4 h-4 appearance-none border-2 bg-white border-blue-600 checked:bg-blue-600"
                  />
                  Most Popular
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilter === "oldest"}
                    onChange={() => {
                      setSelectedFilter(
                        selectedFilter === "oldest" ? null : "oldest",
                      );
                      setSearchParams({
                        ...Object.fromEntries(searchParams),
                        sort: "oldest",
                      });
                    }}
                    className="w-4 h-4 appearance-none border-2 bg-white border-blue-600 checked:bg-blue-600"
                  />
                  Oldest
                </label>
              </div>
            </div>
            <span className="text-xl font-semibold">Categories</span>
            <div className="flex flex-col gap-2">
              <Link
                to={"/posts?category=general"}
                className="cursor-pointer underline hover:text-blue-600"
              >
                General
              </Link>
              <Link
                to={"/posts?category=webDesign"}
                className="cursor-pointer underline hover:text-blue-600"
              >
                Web Design
              </Link>
              <Link
                to={"/posts?category=tvShows/movies"}
                className="cursor-pointer underline hover:text-blue-600"
              >
                TV/Movies
              </Link>
              <Link
                to={"/posts?category=development"}
                className="cursor-pointer underline hover:text-blue-600"
              >
                Development
              </Link>
              <Link
                to={"/posts?category=databases"}
                className="cursor-pointer underline hover:text-blue-600"
              >
                Databases
              </Link>
              <Link
                to={"/posts?category=search-engines"}
                className="cursor-pointer underline hover:text-blue-600"
              >
                Search Engines
              </Link>
              <Link
                to={"/posts?category=marketing"}
                className="cursor-pointer underline hover:text-blue-600"
              >
                Marketing
              </Link>
            </div>
          </div>
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </div>
  );
};

export default PostList;
