import { createContext, useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyAccessToken, setCompanyAccessToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState(false);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get("/api/jobs");
      if (data.success) {
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
      if (error.response?.status === 500 || error.response?.status === 401) {
        // Token expired or invalid — clear it
        setCompanyAccessToken(null);
        setCompanyData(null);
        localStorage.removeItem("companyAccessToken");
        delete axios.defaults.headers.common["Authorization"];
      }
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/users/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setUserData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const fetchUserApplications = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/users/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        // console.log("User applications fetched: ", data.data);
        setUserApplications(data.data);
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
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);
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
    userData,
    userApplications,
    setUserApplications,
    setUserData,
    fetchUserData,
    fetchUserApplications,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
