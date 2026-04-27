import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import kconvert from "k-convert";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/react";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const { jobs, axios, userData, fetchUserApplications, userApplications } =
    useContext(AppContext);
  const { getToken } = useAuth();
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  const appliedjobIds = new Set(
    userApplications.map((app) => app.jobId && app.jobId._id),
  );

  const fetchJobData = async () => {
    try {
      const { data } = await axios.get(`/api/jobs/${id}`);
      if (data.success) {
        setJobData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleApplyForJob = async () => {
    try {
      if (!userData) {
        toast.error("Please login to apply for this job");
        return;
      }
      if (!userData.resume) {
        navigate("/applications");
        toast.error("Upload your resume to proceed");
        return;
      }
      const token = await getToken();
      const { data } = await axios.post(
        "/api/users/apply",
        { jobId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        toast.success(data.message);
        await fetchUserApplications();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const checkIfAlreadyApplied = () => {
    const isApplied = userApplications.some(
      (application) => application.jobId._id === jobData._id,
    );
    setIsAlreadyApplied(isApplied);
  };

  useEffect(() => {
    if (id) {
      fetchJobData();
    }
  }, [id]);

  useEffect(() => {
    if (userApplications.length > 0 && jobData) {
      checkIfAlreadyApplied();
    }
  }, [jobData, userApplications, id]);

  return jobData ? (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="text-white rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-navy-light border border-gray-700 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-navy rounded-lg p-4 mr-4 max-md:mb-4 border border-gray-700"
                src={jobData.companyId.image}
                alt=""
              />
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-4xl font-medium text-white">
                  {jobData.title}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <img className="invert" src={assets.suitcase_icon} alt="" />
                    {jobData.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img className="invert" src={assets.location_icon} alt="" />
                    {jobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img className="invert" src={assets.person_icon} alt="" />
                    {jobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img className="invert" src={assets.money_icon} alt="" />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button
                onClick={handleApplyForJob}
                disabled={isAlreadyApplied}
                className={`${isAlreadyApplied ? "bg-green-500/20 text-green-400 cursor-not-allowed" : "bg-cyan-accent text-navy font-medium"} p-2.5 px-10 rounded`}
              >
                {isAlreadyApplied ? "Applied" : "Apply Now"}
              </button>
              <p className="mt-2 text-gray-500">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>
          {/* job description and more jobs from the same company */}
          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold text-2xl mb-4 text-white">Job description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              ></div>
              <button
                onClick={handleApplyForJob}
                disabled={isAlreadyApplied}
                className={`${isAlreadyApplied ? "bg-green-500/20 text-green-400 cursor-not-allowed" : "bg-cyan-accent text-navy font-medium"} mt-6 p-2.5 px-10 rounded`}
              >
                {isAlreadyApplied ? "Applied" : "Apply Now"}
              </button>
            </div>
            {/* more jobs from the same company*/}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2 className="text-white font-medium">More jobs from {jobData.companyId.name}</h2>
              {jobs
                .filter(
                  (job) =>
                    job._id !== jobData._id &&
                    job.companyId._id === jobData.companyId._id,
                )
                .filter((job) => !appliedjobIds.has(job._id))
                .slice(0, 4)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
