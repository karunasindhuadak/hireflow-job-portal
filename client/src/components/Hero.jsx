import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
  };
  return (
    <div className="container 2xl:px-20 mx-auto py-10">
      <div className="bg-gradient-to-r from-cyan-accent/20 to-navy-light text-white text-center py-16 mx-2 rounded-xl border border-gray-700/50">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
          Find the Right Job for You
        </h2>
        <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5 text-gray-400">
          Explore verified opportunities and take the next step in your career.
        </p>
        <div className="flex items-center justify-between rounded bg-navy-light max-w-xl text-gray-400 pl-4 mx-4 sm:mx-auto border border-gray-700">
          <div className="flex items-center">
            <img className="h-4 sm:h-5" src={assets.search_icon} alt="" />
            <input
              className="max-sm:text-sm p-2 outline-none rounded w-full bg-transparent text-white placeholder-gray-500"
              ref={titleRef}
              type="text"
              placeholder="Search for jobs"
            />
          </div>
          <div className="flex items-center">
            <img className="h-4 sm:h-5" src={assets.location_icon} alt="" />
            <input
              className="max-sm:text-sm p-2 outline-none rounded w-full bg-transparent text-white placeholder-gray-500"
              ref={locationRef}
              type="text"
              placeholder="Location"
            />
          </div>
          <button
            onClick={onSearch}
            className="bg-cyan-accent px-6 py-2 rounded text-navy font-medium m-1"
          >
            Search
          </button>
        </div>
      </div>

      <div className="border border-gray-700 shadow-md mx-2 mt-5 p-6 rounded-md flex bg-navy-light">
        <div className="flex justify-center gap-10 lg:gap-16 flex-wrap">
          <p className="font-medium text-gray-300">Trusted by</p>
          <img
            className="h-6 brightness-200"
            src={assets.microsoft_logo}
            alt=""
          />
          <img
            className="h-6 brightness-200"
            src={assets.walmart_logo}
            alt=""
          />
          <img
            className="h-6 brightness-200"
            src={assets.samsung_logo}
            alt=""
          />
          <img
            className="h-6 brightness-200"
            src={assets.accenture_logo}
            alt=""
          />
          <img className="h-6 brightness-200" src={assets.amazon_logo} alt="" />
          <img className="h-6 brightness-200" src={assets.adobe_logo} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
