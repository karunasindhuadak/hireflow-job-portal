import React from "react";
import { assets } from "../assets/assets";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const { companyData, handleLogout } = useContext(AppContext);
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    // navigate("/dashboard/*");
  };

  return (
    <div className="min-h-screen">
      {/*Navbar for Recruiter Panel*/}
      <div className="shadow py-4">
        <div className="px-5 flex justify-between items-center">
          <img
            onClick={() => navigate("/")}
            className="max-sm:w-32 sm:h-10 cursor-pointer"
            src={assets.logo}
            alt=""
          />
          {companyData && (
            <div className="flex items-center gap-3">
              <p className="max-sm:hidden">
                Welcome, {companyData?.name || "Recruiter"}
              </p>
              <div className="relative group">
                <img
                  className="w-8 border rounded-full"
                  src={companyData?.image || assets.person_icon}
                  alt=""
                />
                <div className="absolute hidden group-hover:block top-full right-0 z-10 text-black rounded pt-2">
                  <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm shadow-md">
                    <li
                      onClick={() => onLogout()}
                      className="py-1 px-2 cursor-pointer pr-10 hover:bg-gray-50 rounded"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start">
        {/* Left Sidebar */}
        <div className="inline-block min-h-screen border-r border-gray-300">
          <ul className="flex flex-col items-start pt-5 text-gray-800">
            <li className="w-full">
              <NavLink
                className={({ isActive }) =>
                  `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && "bg-blue-100 border-r-4 border-blue-500"}`
                }
                to={"/dashboard/add-job"}
              >
                <img className="min-w-4" src={assets.add_icon} alt="" />
                <p className="max-sm:hidden">Add Job</p>
              </NavLink>
            </li>

            <li className="w-full">
              <NavLink
                className={({ isActive }) =>
                  `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && "bg-blue-100 border-r-4 border-blue-500"}`
                }
                to={"/dashboard/manage-jobs"}
              >
                <img className="min-w-4" src={assets.home_icon} alt="" />
                <p className="max-sm:hidden">Manage Jobs</p>
              </NavLink>
            </li>

            <li className="w-full">
              <NavLink
                className={({ isActive }) =>
                  `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && "bg-blue-100 border-r-4 border-blue-500"}`
                }
                to={"/dashboard/view-applications"}
              >
                <img className="min-w-4" src={assets.person_tick_icon} alt="" />
                <p className="max-sm:hidden">View Applications</p>
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
