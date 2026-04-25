import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyAccessToken, setCompanyAccessToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get("/api/jobs");
      if (data.success) {
        console.log("Jobs fetched: ", data.data);
        setJobs(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  // Function to handle logout
  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/company/logout");
      if (data.success) {
        setCompanyAccessToken(null);
        setCompanyData(null);
        localStorage.removeItem("companyAccessToken");
        delete axios.defaults.headers.common["Authorization"];
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  // Function to fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get("/api/company/company-data");
      if (data.success) {
        setCompanyData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    fetchJobs();
    const getCompanyAccessToken = localStorage.getItem("companyAccessToken");
    if (getCompanyAccessToken) {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${getCompanyAccessToken}`;
      setCompanyAccessToken(getCompanyAccessToken);
    }
  }, []);
  useEffect(() => {
    if (companyAccessToken) {
      fetchCompanyData();
    }
  }, [companyAccessToken]);
  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    setCompanyAccessToken,
    companyAccessToken,
    companyData,
    setCompanyData,
    axios,
    handleLogout,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
