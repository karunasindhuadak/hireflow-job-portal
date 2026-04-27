import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruiterLogin = () => {
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false);
  const {
    setShowRecruiterLogin,
    setCompanyAccessToken,
    axios,
    setCompanyData,
  } = useContext(AppContext);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (state === "Sign Up" && !isTextDataSubmited) {
      setIsTextDataSubmited(true);
      return;
    }
    try {
      if (state === "Login") {
        const { data } = await axios.post("/api/company/login", {
          email,
          password,
        });
        if (data.success) {
          // console.log(data);
          setCompanyData(data.data.company);
          setCompanyAccessToken(data.data.accessToken);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${data.data.accessToken}`;
          localStorage.setItem("companyAccessToken", data.data.accessToken);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        const formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("image", image);

        const { data } = await axios.post("/api/company/register", formdata);

        if (data.success) {
          setCompanyData(data.data.company);
          setCompanyAccessToken(data.data.accessToken);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${data.data.accessToken}`;
          localStorage.setItem("companyAccessToken", data.data.accessToken);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowRecruiterLogin(false);
      }}
    >
      <form
        onSubmit={handleFormSubmit}
        aria-label={`Recruiter ${state} form`}
        className="relative bg-white p-10 rounded-xl text-slate-500 max-w-md w-full mx-4 animate-fade-in"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm text-center">
          Welcome back! Please{" "}
          <span>{state === "Login" ? "login" : "sign up"}</span> to continue
        </p>
        {state === "Sign Up" && isTextDataSubmited ? (
          <>
            <div className="flex items-center gap-4 my-10">
              <label htmlFor="image">
                <img
                  className="w-16 rounded-full"
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt=""
                />
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  name=""
                  id="image"
                  hidden
                />
              </label>
              <p>
                Upload Company <br /> logo
              </p>
            </div>
          </>
        ) : (
          <>
            {state !== "Login" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  className="outline-none text-sm w-full"
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                />
              </div>
            )}
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none text-sm w-full"
                value={email}
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="outline-none text-sm w-full"
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </>
        )}

        {state === "Login" && (
          <p className="text-sm text-blue-600 mt-4 cursor-pointer">
            Forgot password?
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 mt-4 w-full text-white py-2 rounded-full cursor-pointer"
        >
          {state === "Login"
            ? "login"
            : isTextDataSubmited
              ? "create account"
              : "next"}
        </button>
        {state === "Login" && (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setState("Sign Up");
                setIsTextDataSubmited(false);
                setName("");
                setEmail("");
                setPassword("");
              }}
            >
              Sign up
            </span>
          </p>
        )}
        {state === "Sign Up" && (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => {
                setState("Login");
                setName("");
                setEmail("");
                setPassword("");
              }}
            >
              Login
            </span>
          </p>
        )}
        <button
          type="button"
          onClick={() => setShowRecruiterLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          aria-label="Close recruiter login"
        >
          <img src={assets.cross_icon} alt="" />
        </button>
      </form>
    </div>
  );
};

export default RecruiterLogin;
