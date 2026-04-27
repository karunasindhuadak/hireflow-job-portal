import React, { useContext, useEffect, useState } from "react";
import { manageJobsData } from "../assets/assets";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(false);
  const { axios, companyAccessToken } = useContext(AppContext);
  // Function to fetch jobs posted by the company
  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get("/api/company/list-jobs");
      if (data.success) {
        // console.log("Company jobs: ", data);
        setJobs(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleChangeJobVisibility = async (jobId) => {
    try {
      const { data } = await axios.post("/api/company/change-visibility", {
        id: jobId,
      });
      if (data.success) {
        // console.log("Visibility changed: ", data.data);
        fetchCompanyJobs();
        toast.success(
          `${data.data.visible ? "Job is now visible" : "Job is now hidden"}`,
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    if (companyAccessToken) {
      fetchCompanyJobs();
    }
  }, [companyAccessToken]);
  return jobs ? (
    jobs.length === 0 ? (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl sm: text-2xl">No Jobs Available or Posted</p>
      </div>
    ) : (
      <div className="container p-4 max-w-5xl">
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full bg-white border-collapse max-sm:text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 border border-gray-200 text-left font-semibold max-sm:hidden">
                  #
                </th>
                <th className="py-3 px-4 border border-gray-200 text-left font-semibold">
                  Job Title
                </th>
                <th className="py-3 px-4 border border-gray-200 text-left font-semibold max-sm:hidden">
                  Date
                </th>
                <th className="py-3 px-4 border border-gray-200 text-left font-semibold max-sm:hidden">
                  Location
                </th>
                <th className="py-3 px-4 border border-gray-200 text-center font-semibold">
                  Applicants
                </th>
                <th className="py-3 px-4 border border-gray-200 text-left font-semibold">
                  Visible
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr
                  key={index}
                  className="text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 border border-gray-200 max-sm:hidden">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 border border-gray-200">
                    {job.title}
                  </td>
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
                      onChange={() => handleChangeJobVisibility(job._id)}
                      className="scale-125 ml-4 accent-blue-600 cursor-pointer"
                      type="checkbox"
                      checked={job.visible}
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
    )
  ) : (
    <Loading />
  );
};

export default ManageJobs;
