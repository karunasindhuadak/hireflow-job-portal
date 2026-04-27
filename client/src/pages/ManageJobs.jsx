import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(false);
  const { axios, companyAccessToken } = useContext(AppContext);

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get("/api/company/list-jobs");
      if (data.success) {
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
        <p className="text-xl sm:text-2xl">No Jobs Available or Posted</p>
      </div>
    ) : (
      <div className="container p-4 max-w-5xl">
        <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-sm">
          <table className="min-w-full bg-navy-light border-collapse max-sm:text-sm">
            <thead>
              <tr className="bg-navy text-gray-400">
                <th className="py-3 px-4 border border-gray-700 text-left font-semibold max-sm:hidden">
                  #
                </th>
                <th className="py-3 px-4 border border-gray-700 text-left font-semibold">
                  Job Title
                </th>
                <th className="py-3 px-4 border border-gray-700 text-left font-semibold max-sm:hidden">
                  Date
                </th>
                <th className="py-3 px-4 border border-gray-700 text-left font-semibold max-sm:hidden">
                  Location
                </th>
                <th className="py-3 px-4 border border-gray-700 text-center font-semibold">
                  Applicants
                </th>
                <th className="py-3 px-4 border border-gray-700 text-left font-semibold">
                  Visible
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr
                  key={index}
                  className="text-gray-300 hover:bg-navy transition-colors"
                >
                  <td className="py-3 px-4 border border-gray-700 max-sm:hidden">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 border border-gray-700">
                    {job.title}
                  </td>
                  <td className="py-3 px-4 border border-gray-700 max-sm:hidden">
                    {moment(job.date).format("ll")}
                  </td>
                  <td className="py-3 px-4 border border-gray-700 max-sm:hidden">
                    {job.location}
                  </td>
                  <td className="py-3 px-4 border border-gray-700 text-center">
                    {job.applicants}
                  </td>
                  <td className="py-3 px-4 border border-gray-700">
                    <input
                      onChange={() => handleChangeJobVisibility(job._id)}
                      className="scale-125 ml-4 accent-cyan-accent cursor-pointer"
                      type="checkbox"
                      checked={job.visible}
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
            className="bg-cyan-accent text-navy px-4 py-2 rounded font-medium hover:bg-cyan-accent/90 transition-colors"
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
