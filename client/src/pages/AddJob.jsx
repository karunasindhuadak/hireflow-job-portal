import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { JobCategories, JobLocations } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Programming");
  const [location, setLocation] = useState("Bangalore");
  const [level, setLevel] = useState("Beginner Level");
  const [salary, setSalary] = useState(0);
  const { axios } = useContext(AppContext);
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const description = quillRef.current.root.innerHTML;
      const { data } = await axios.post("/api/company/post-job", {
        title, category, location, level, salary, description,
      });
      if (data.success) {
        toast.success("Job posted successfully");
        setTitle("");
        setSalary(0);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <form onSubmit={handleFormSubmit} className="container p-4 flex flex-col w-full items-start gap-3">
      <div className="w-full">
        <p className="mb-2 text-gray-300">Job Title</p>
        <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Type here" value={title} required className="w-full max-w-lg px-3 py-2 border border-gray-700 rounded bg-navy text-white placeholder-gray-500 outline-none" />
      </div>
      <div className="w-full max-w-lg">
        <p className="my-2 text-gray-300">Job Description</p>
        <div className="bg-navy-light border border-gray-700 rounded" ref={editorRef}></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2 text-gray-300">Job Category</p>
          <select className="w-full px-3 py-2 border border-gray-700 rounded bg-navy text-white outline-none" onChange={(e) => setCategory(e.target.value)}>
            {JobCategories.map((cat, i) => (<option key={i} value={cat}>{cat}</option>))}
          </select>
        </div>
        <div>
          <p className="mb-2 text-gray-300">Job Location</p>
          <select className="w-full px-3 py-2 border border-gray-700 rounded bg-navy text-white outline-none" onChange={(e) => setLocation(e.target.value)}>
            {JobLocations.map((loc, i) => (<option key={i} value={loc}>{loc}</option>))}
          </select>
        </div>
        <div>
          <p className="mb-2 text-gray-300">Job Level</p>
          <select className="w-full px-3 py-2 border border-gray-700 rounded bg-navy text-white outline-none" onChange={(e) => setLevel(e.target.value)}>
            <option value="Beginner Level">Beginner Level</option>
            <option value="Intermediate Level">Intermediate Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>
      </div>
      <div>
        <p className="mb-2 text-gray-300">Salary</p>
        <input onChange={(e) => setSalary(Number(e.target.value))} type="number" min={0} placeholder="Enter salary" className="w-full px-3 py-2 border border-gray-700 rounded bg-navy text-white placeholder-gray-500 sm:w-[150px] outline-none" />
      </div>
      <button type="submit" className="w-28 py-3 mt-4 bg-cyan-accent text-navy rounded font-medium">ADD</button>
    </form>
  );
};

export default AddJob;
