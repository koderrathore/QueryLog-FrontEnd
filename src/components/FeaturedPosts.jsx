import React from "react";
import Image from "./Image";
import feature1 from "/public/images/feature1.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

const FeaturedPosts = () => {
  const fetchPosts = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`,
    );
    console.log(res);
    return res?.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: () => fetchPosts(),
  });
  console.log(data);
  console.log(error);

  const feature = data?.posts;
  return (
    <div className=" flex flex-col md:flex-row md:gap-4 lg:gap-28 pb-4 ">
      {feature && feature.length > 0 ? (
        <>
          <div className="w-full md:w-1/2 flex flex-col gap-1 pb-4 md:pb-0">
            <Image
              src={feature[0]?.coverImage}
              className="rounded-3xl object-cover md:w-80 lg:w-full"
              w="767"
            />
            <div className="flex gap-2">
              <span>0.1</span>
              <Link className="text-blue-700 cursor-pointer">
                {feature[0]?.category}
              </Link>
              <span>{format(feature[0]?.createdAt)}</span>
            </div>
            <div className="font-bold md:text-xl lg:text-2xl line-clamp-2">
              {feature[0]?.content}{" "}
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {
              feature && feature[1]?
              <div className="flex gap-2 ">
              <Image
                w="400"
                src={feature[1]?.coverImage}
                className="rounded-3xl w-24 md:w-36 lg:w-60 object-cover"
                />
              <div className="flex flex-col gap-1 md:gap-4 lg:gap-12">
                <div className="flex justify-between text-xs lg:text-xl">
                  <span>0.4</span>
                  <Link className="text-blue-700 cursor-pointer">
                    {feature[1]?.category}
                  </Link>
                  <span>{format(feature[1]?.createdAt)}</span>
                </div>
                 <div className=" lg:text-2xl line-clamp-2">
                  {feature[1]?.content}{" "}
                </div>
              </div>
            </div>:null
              }
            {feature && feature[2] ? (
              <div className="flex gap-2 ">
                <Image
                  w="400"
                  src={feature[2]?.coverImage}
                  className="rounded-3xl w-24 md:w-36 lg:w-60 object-cover"
                />
                <div className="flex flex-col gap-1 md:gap-4 lg:gap-12">
                  <div className="flex justify-between text-xs lg:text-xl">
                    <span>0.4</span>
                    <Link className="text-blue-700 cursor-pointer">
                      {feature[2]?.category}
                    </Link>
                    <span>{format(feature[2]?.createdAt)}</span>
                  </div>
                  <div className=" lg:text-2xl line-clamp-2">
                    {feature[2]?.content}{" "}
                  </div>
                </div>
              </div>
            ) : null}
            {feature && feature[3] ? (
              <div className="flex gap-2 ">
                <Image
                  w="400"
                  src={feature[3]?.coverImage}
                  className="rounded-3xl w-24 md:w-36 lg:w-60 object-cover"
                />
                <div className="flex flex-col gap-1 md:gap-4 lg:gap-12">
                  <div className="flex justify-between text-xs lg:text-xl">
                    <span>0.4</span>
                    <Link className="text-blue-700 cursor-pointer">
                      {feature[3]?.category}
                    </Link>
                    <span>{format(feature[3]?.createdAt)}</span>
                  </div>
                  <div className=" lg:text-2xl line-clamp-2">
                    {feature[3]?.content}{" "}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div>No Feature Posts!</div>
      )}
    </div>
  );
};

export default FeaturedPosts;
