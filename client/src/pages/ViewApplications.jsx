import React from "react";
import { assets, viewApplicationsPageData } from "../assets/assets";

const ViewApplications = () => {
  return (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-visible rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white border-collapse max-sm:text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 border border-gray-200 text-left font-semibold">
                #
              </th>
              <th className="py-3 px-4 border border-gray-200 text-left font-semibold">
                User name
              </th>
              <th className="py-3 px-4 border border-gray-200 text-left font-semibold max-sm:hidden">
                Job Title
              </th>
              <th className="py-3 px-4 border border-gray-200 text-left font-semibold max-sm:hidden">
                Location
              </th>
              <th className="py-3 px-4 border border-gray-200 text-left font-semibold">
                Resume
              </th>
              <th className="py-3 px-4 border border-gray-200 text-center font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {viewApplicationsPageData.map((applicant, index) => (
              <tr
                key={index}
                className="text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 border border-gray-200">
                  {index + 1}
                </td>
                <td className="py-3 px-4 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-10 h-10 rounded-full max-sm:hidden"
                      src={applicant.imgSrc}
                      alt=""
                    />
                    {applicant.name}
                  </div>
                </td>
                <td className="py-3 px-4 border border-gray-200 max-sm:hidden">
                  {applicant.jobTitle}
                </td>
                <td className="py-3 px-4 border border-gray-200 max-sm:hidden">
                  {applicant.location}
                </td>
                <td className="py-3 px-4 border border-gray-200">
                  <a
                    href=""
                    className="bg-blue-50 text-blue-500 px-3 py-1 rounded inline-flex gap-2 items-center hover:bg-blue-100 transition-colors"
                  >
                    Resume <img src={assets.resume_download_icon} alt="" />
                  </a>
                </td>
                <td className="py-3 px-4 border border-gray-200 relative text-center">
                  <div className="relative inline-block group">
                    <button className="text-gray-500 action-button">...</button>
                    <div className="z-10 hidden absolute right-0 left-0 top-full pt-2 w-32 group-hover:block">
                      <div className="bg-white border border-gray-200 rounded shadow-md">
                        <button className="block w-full text-center px-4 py-2 text-blue-500 hover:bg-gray-100">
                          Accept
                        </button>
                        <button className="block w-full text-center px-4 py-2 text-red-500 hover:bg-gray-100">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;
