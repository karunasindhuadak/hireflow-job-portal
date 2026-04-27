import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const { companyData, handleLogout } = useContext(AppContext);
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate("/");
  };
  useEffect(() => {
    if (companyData) {
      navigate("/dashboard/manage-jobs");
    }
  }, [companyData]);
  return (
    <div className="min-h-screen bg-navy">
      {/*Navbar for Recruiter Panel*/}
      <div className="shadow shadow-gray-800/50 py-4 bg-navy">
        <div className="px-5 flex justify-between items-center">
          <img
            onClick={() => navigate("/")}
            className="max-sm:w-32 sm:h-10 cursor-pointer"
            src={assets.logo}
            alt=""
          />
          {companyData && (
            <div className="flex items-center gap-3">
              <p className="max-sm:hidden text-gray-300">
                Welcome, {companyData?.name || "Recruiter"}
              </p>
              <div className="relative group">
                <img
                  className="w-8 border border-gray-600 rounded-full"
                  src={companyData?.image || assets.person_icon}
                  alt=""
                />
                <div className="absolute hidden group-hover:block top-full right-0 z-10 rounded pt-2">
                  <ul className="list-none m-0 p-2 bg-navy-light rounded-md border border-gray-700 text-sm shadow-md">
                    <li
                      onClick={() => onLogout()}
                      className="py-1 px-2 cursor-pointer pr-10 hover:bg-navy rounded text-gray-300"
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
        <div className="inline-block min-h-screen border-r border-gray-700 bg-navy">
          <ul className="flex flex-col items-start pt-5">
            <li className="w-full">
              <NavLink
                className={({ isActive }) =>
                  `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-navy-light text-gray-400 ${isActive && "bg-navy-light border-r-4 border-cyan-accent text-cyan-accent"}`
                }
                to={"/dashboard/add-job"}
              >
                <img className="min-w-4 invert" src={assets.add_icon} alt="" />
                <p className="max-sm:hidden">Add Job</p>
              </NavLink>
            </li>

            <li className="w-full">
              <NavLink
                className={({ isActive }) =>
                  `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-navy-light text-gray-400 ${isActive && "bg-navy-light border-r-4 border-cyan-accent text-cyan-accent"}`
                }
                to={"/dashboard/manage-jobs"}
              >
                <img className="min-w-4 invert" src={assets.home_icon} alt="" />
                <p className="max-sm:hidden">Manage Jobs</p>
              </NavLink>
            </li>

            <li className="w-full">
              <NavLink
                className={({ isActive }) =>
                  `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-navy-light text-gray-400 ${isActive && "bg-navy-light border-r-4 border-cyan-accent text-cyan-accent"}`
                }
                to={"/dashboard/view-applications"}
              >
                <img
                  className="min-w-4 invert"
                  src={assets.person_tick_icon}
                  alt=""
                />
                <p className="max-sm:hidden">View Applications</p>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="flex-1 h-full p-2 sm:p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
