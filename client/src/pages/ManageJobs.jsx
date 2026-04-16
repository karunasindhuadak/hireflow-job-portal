import React from "react";
import { manageJobsData } from "../assets/assets";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ManageJobs = () => {
  const navigate = useNavigate();
  return (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white border-collapse max-sm:text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 border border-gray-200 text-left font-semibold max-sm:hidden">#</th>
              <th className="py-3 px-4 border border-gray-200 text-left font-semibold">Job Title</th>
              <th className="py-3 px-4 border border-gray-200 text-left font-semibold max-sm:hidden">
                Date
              </th>
              <th className="py-3 px-4 border border-gray-200 text-left font-semibold max-sm:hidden">
                Location
              </th>
              <th className="py-3 px-4 border border-gray-200 text-center font-semibold">Applicants</th>
              <th className="py-3 px-4 border border-gray-200 text-left font-semibold">Visible</th>
            </tr>
          </thead>
          <tbody>
            {manageJobsData.map((job, index) => (
              <tr key={index} className="text-gray-700 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 border border-gray-200 max-sm:hidden">
                  {index + 1}
                </td>
                <td className="py-3 px-4 border border-gray-200">{job.title}</td>
                <td className="py-3 px-4 border border-gray-200 max-sm:hidden">
                  {moment(job.date).format("ll")}
                </td>
                <td className="py-3 px-4 border border-gray-200 max-sm:hidden">
                  {job.location}
                </td>
                <td className="py-3 px-4 border border-gray-200 text-center">
                  {job.applicants}
                </td>
                <td className="py-3 px-4 border border-gray-200">
                  <input
                    className="scale-125 ml-4 accent-blue-600 cursor-pointer"
                    type="checkbox"
                    name=""
                    id=""
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigate("/dashboard/add-job")}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Add new job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;
