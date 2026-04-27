import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useAuth } from "@clerk/react";
import axios from "axios";
import { toast } from "react-toastify";

import Loading from "../components/Loading";

const Applications = () => {
  // console.log("User in applications page: ", user);
  const { getToken } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const { fetchUserData, userData, userApplications } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  // const [jobsApplied, setJobsApplied] = useState([])

  const handleResumeUpload = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      // Make API call to upload resume
      const token = await getToken();
      const { data } = await axios.post("/api/users/update-resume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setIsEdit(false);
    setResume(null);
    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-20">
        <h2>Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit || (userData && userData.resume === "") ? (
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                  {resume ? resume.name : "Upload Resume"}
                </p>
                <input
                  onChange={(e) => setResume(e.target.files[0])}
                  accept="application/pdf"
                  type="file"
                  name=""
                  id="resumeUpload"
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="" />
              </label>
              <button
                onClick={handleResumeUpload}
                className="bg-green-100 border border-green-400 px-4 py-2 rounded-lg"
              >
                {loading ? "Uploading..." : "Save"}
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-xl"
                href={userData?.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        {userApplications ? (
          userApplications.length === 0 ? (
            <div className="flex items-center justify-center h-[50vh]">
              <p className="text-xl sm: text-2xl">
                You have not applied to any jobs yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="min-w-full bg-white overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider max-sm:hidden">
                      Location
                    </th>
                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider max-sm:hidden">
                      Date
                    </th>
                    <th className="py-3 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userApplications.map((job, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 even:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3 px-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <img
                            className="h-8 w-8"
                            src={job.companyId.image}
                            alt=""
                          />
                          {job.companyId.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        {job.jobId.title}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 max-sm:hidden">
                        {job.jobId.location}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 max-sm:hidden">
                        {moment(job.date).format("ll")}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        <span
                          className={`${job.status === "Accepted" ? "bg-green-100 text-green-700" : job.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"} px-4 py-1.5 rounded-full text-sm font-medium`}
                        >
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            <Loading />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Applications;
