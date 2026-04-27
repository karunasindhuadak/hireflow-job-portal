import React from "react";
import { assets} from "../assets/assets";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Loading from "../components/Loading";

const ViewApplications = () => {
  const [viewApplicationsData, setViewApplicationsData] = useState(false);
  const { axios, companyAccessToken } = useContext(AppContext);

  // Function to fetch company's job applicants data
  const fetchApplicantsData = async () => {
    try {
      const { data } = await axios.get("/api/company/applicants");
      if (data.success) {
        console.log("Applicants data: ", data.data);
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
      const { data } = await axios.post("/api/company/change-status", {
        id: applicationId,
        status,
      });
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
  return viewApplicationsData ? (
    viewApplicationsData.length === 0 ? (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl sm: text-2xl">No Applications Available</p>
      </div>
    ) : (
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
              {viewApplicationsData
                .filter((item) => item.userId && item.jobId)
                .map((applicant, index) => (
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
                          src={applicant.userId.image}
                          alt=""
                        />
                        {applicant.userId.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 border border-gray-200 max-sm:hidden">
                      {applicant.jobId.title}
                    </td>
                    <td className="py-3 px-4 border border-gray-200 max-sm:hidden">
                      {applicant.jobId.location}
                    </td>
                    <td className="py-3 px-4 border border-gray-200">
                      <a
                        href={applicant.userId.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-50 text-blue-500 px-3 py-1 rounded inline-flex gap-2 items-center hover:bg-blue-100 transition-colors"
                      >
                        Resume <img src={assets.resume_download_icon} alt="" />
                      </a>
                    </td>
                    <td className="py-3 px-4 border border-gray-200 relative text-center">
                      {applicant.status === "Pending" ? (
                        <div className="relative inline-block group">
                          <button className="text-gray-500 action-button">
                            ...
                          </button>
                          <div className="z-10 hidden absolute left-0 -translate-x-1/4 top-full pt-2 w-25 group-hover:block">
                            <div className="bg-white border border-gray-200 rounded shadow-md">
                              <button
                                onClick={() =>
                                  handleStatusChange(applicant._id, "Accepted")
                                }
                                className="block w-full text-center px-4 py-2 text-blue-500 hover:bg-gray-100"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(applicant._id, "Rejected")
                                }
                                className="block w-full text-center px-4 py-2 text-red-500 hover:bg-gray-100"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span
                          className={`${applicant.status === "Accepted" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} px-3 py-1 rounded`}
                        >
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
    )
  ) : (
    <Loading />
  );
};

export default ViewApplications;
