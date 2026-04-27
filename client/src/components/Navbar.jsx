import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const { setShowRecruiterLogin } = useContext(AppContext);
  return (
    <div className="shadow shadow-gray-800/50 py-3 bg-navy">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img
          onClick={() => navigate("/")}
          className="h-10 cursor-pointer"
          src={assets.logo}
          alt=""
        />
        {isLoaded ? (
          isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link className="text-gray-300 hover:text-cyan-accent" to={"/applications"}>Applied Jobs</Link>
              <p className="text-gray-500">|</p>
              <p className="max-sm:hidden text-gray-300">
                {"Hi, " + " " + user.firstName + " " + user.lastName}
              </p>
              <UserButton />
            </div>
          ) : (
            <div className="flex gap-4 max-sm:text-sm">
              <button
                onClick={(e) => setShowRecruiterLogin(true)}
                className="text-gray-400 hover:text-cyan-accent"
              >
                Recruiter Login
              </button>
              <button
                onClick={() => openSignIn()}
                className="bg-cyan-accent text-navy px-6 sm:px-9 py-2 rounded-full font-medium"
              >
                Login
              </button>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
