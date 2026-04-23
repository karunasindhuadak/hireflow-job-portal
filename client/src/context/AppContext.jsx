import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
    setJobs(jobsData);
  };
  // Function to handle logout
  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${companyAccessToken}`,
          },
        },
      );
      if (data.success) {
        setCompanyAccessToken(null);
        setCompanyData(null);
        localStorage.removeItem("companyAccessToken");
        // localStorage.removeItem("accessToken");
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  // Function to fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/company/company-data`,
        {
          headers: {
            Authorization: `Bearer ${companyAccessToken}`,
          },
        },
      );
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
    backendUrl,
    handleLogout,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
