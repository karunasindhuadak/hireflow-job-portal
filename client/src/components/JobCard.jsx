import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div className="border border-gray-700 p-6 shadow rounded bg-navy-light">
      <div className="flex justify-between items-center">
        <img className="h-8" src={job.companyId.image} alt="" />
      </div>
      <h4 className="font-medium text-xl mt-2 text-white">{job.title}</h4>
      <div className="flex items-center gap-3 mt-2 text-xs">
        <span className="bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent px-4 py-1.5 rounded">
          {job.location}
        </span>
        <span className="bg-coral-accent/10 border border-coral-accent/30 text-coral-accent px-4 py-1.5 rounded">
          {job.level}
        </span>
      </div>
      <p
        className="text-gray-400 text-sm mt-4 job-description-preview"
        dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}
      ></p>
      <div className="mt-4 flex gap-4 text-sm">
        <button
          onClick={() => navigate(`/apply-job/${job._id}`)}
          className="bg-cyan-accent text-navy px-4 py-2 rounded font-medium"
        >
          Apply now
        </button>
        <button
          onClick={() => navigate(`/apply-job/${job._id}`)}
          className="text-gray-400 border border-gray-600 px-4 py-2 rounded hover:border-gray-400"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default JobCard;
