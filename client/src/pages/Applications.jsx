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

const Applications = () => {
  const { getToken } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const { fetchUserData, userData, userApplications } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

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
        <h2 className="text-white text-lg font-medium">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit || (userData && userData.resume === "") ? (
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-cyan-accent/10 text-cyan-accent px-4 py-2 rounded-lg mr-2 border border-cyan-accent/30">
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
                <img
                  className="invert"
                  src={assets.profile_upload_icon}
                  alt=""
                />
              </label>
              <button
                onClick={handleResumeUpload}
                className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg"
              >
                {loading ? "Uploading..." : "Save"}
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                className="bg-cyan-accent/10 text-cyan-accent px-4 py-2 rounded-xl border border-cyan-accent/30"
                href={userData?.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-400 border border-gray-600 rounded-lg px-4 py-2 hover:border-gray-400"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-4 text-white">Jobs Applied</h2>
        {userApplications.length === 0 ? (
          <div className="flex items-center justify-center h-[30vh]">
            <p className="text-xl sm:text-2xl">
              You have not applied to any jobs yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-700 rounded-lg">
            <table className="min-w-full bg-navy-light overflow-hidden">
              <thead className="bg-navy">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-700 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="py-3 px-4 border-b border-gray-700 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="py-3 px-4 border-b border-gray-700 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider max-sm:hidden">
                    Location
                  </th>
                  <th className="py-3 px-4 border-b border-gray-700 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider max-sm:hidden">
                    Date
                  </th>
                  <th className="py-3 px-4 border-b border-gray-700 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {userApplications.map((job, index) => (
                  <tr
                    key={index}
                    className="hover:bg-navy transition-colors text-gray-300"
                  >
                    <td className="py-3 px-4 border-b border-gray-700/50">
                      <div className="flex items-center gap-2">
                        <img
                          className="h-8 w-8"
                          src={job.companyId.image}
                          alt=""
                        />
                        {job.companyId.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700/50">
                      {job.jobId.title}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700/50 max-sm:hidden">
                      {job.jobId.location}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700/50 max-sm:hidden">
                      {moment(job.date).format("ll")}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-700/50">
                      <span
                        className={`${job.status === "Accepted" ? "bg-green-500/20 text-green-400" : job.status === "Rejected" ? "bg-coral-accent/20 text-coral-accent" : "bg-cyan-accent/20 text-cyan-accent"} px-4 py-1.5 rounded-full text-sm font-medium`}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Applications;
