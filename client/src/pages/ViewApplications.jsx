import React from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useEffect } from "react";

const ViewApplications = () => {
  const [viewApplicationsData, setViewApplicationsData] = useState([]);
  const { axios, companyAccessToken } = useContext(AppContext);

  const fetchApplicantsData = async () => {
    try {
      const { data } = await axios.get("/api/company/applicants");
      if (data.success) {
        setViewApplicationsData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleStatusChange = async (applicationId, status) => {
    try {
      const { data } = await axios.post("/api/company/change-status", { id: applicationId, status });
      if (data.success) {
        fetchApplicantsData();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (companyAccessToken) {
      fetchApplicantsData();
    }
  }, [companyAccessToken]);

  return (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-visible rounded-lg border border-gray-700 shadow-sm">
        <table className="min-w-full bg-navy-light border-collapse max-sm:text-sm">
          <thead>
            <tr className="bg-navy text-gray-400">
              <th className="py-3 px-4 border border-gray-700 text-left font-semibold">#</th>
              <th className="py-3 px-4 border border-gray-700 text-left font-semibold">User name</th>
              <th className="py-3 px-4 border border-gray-700 text-left font-semibold max-sm:hidden">Job Title</th>
              <th className="py-3 px-4 border border-gray-700 text-left font-semibold max-sm:hidden">Location</th>
              <th className="py-3 px-4 border border-gray-700 text-left font-semibold">Resume</th>
              <th className="py-3 px-4 border border-gray-700 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {viewApplicationsData
              .filter((item) => item.userId && item.jobId)
              .map((applicant, index) => (
                <tr key={index} className="text-gray-300 hover:bg-navy transition-colors">
                  <td className="py-3 px-4 border border-gray-700">{index + 1}</td>
                  <td className="py-3 px-4 border border-gray-700">
                    <div className="flex items-center gap-2">
                      <img className="w-10 h-10 rounded-full max-sm:hidden" src={applicant.userId.image} alt="" />
                      {applicant.userId.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 border border-gray-700 max-sm:hidden">{applicant.jobId.title}</td>
                  <td className="py-3 px-4 border border-gray-700 max-sm:hidden">{applicant.jobId.location}</td>
                  <td className="py-3 px-4 border border-gray-700">
                    <a href={applicant.userId.resume} target="_blank" rel="noopener noreferrer" className="bg-cyan-accent/10 text-cyan-accent px-3 py-1 rounded inline-flex gap-2 items-center hover:bg-cyan-accent/20 transition-colors border border-cyan-accent/30">
                      Resume <img className="invert" src={assets.resume_download_icon} alt="" />
                    </a>
                  </td>
                  <td className="py-3 px-4 border border-gray-700 relative text-center">
                    {applicant.status === "Pending" ? (
                      <div className="relative inline-block group">
                        <button className="text-gray-400 action-button">...</button>
                        <div className="z-10 hidden absolute left-0 -translate-x-1/4 top-full pt-2 w-25 group-hover:block">
                          <div className="bg-navy border border-gray-700 rounded shadow-md">
                            <button onClick={() => handleStatusChange(applicant._id, "Accepted")} className="block w-full text-center px-4 py-2 text-cyan-accent hover:bg-navy-light">Accept</button>
                            <button onClick={() => handleStatusChange(applicant._id, "Rejected")} className="block w-full text-center px-4 py-2 text-coral-accent hover:bg-navy-light">Reject</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className={`${applicant.status === "Accepted" ? "bg-green-500/20 text-green-400" : "bg-coral-accent/20 text-coral-accent"} px-3 py-1 rounded`}>
                        {applicant.status}
                      </span>
                    )}
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
