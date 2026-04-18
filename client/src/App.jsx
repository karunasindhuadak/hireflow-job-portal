import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import RecruiterLogin from "./components/RecruiterLogin";
import { AppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import "quill/dist/quill.snow.css";
import * as Sentry from "@sentry/react";

const App = () => {
  const { showRecruiterLogin } = useContext(AppContext);
  return (
    <Sentry.ErrorBoundary fallback={<p>Something went wrong.</p>}>
      <div>
        {showRecruiterLogin && <RecruiterLogin />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply-job/:id" element={<ApplyJob />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="add-job" element={<AddJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="view-applications" element={<ViewApplications />} />
          </Route>
        </Routes>
      </div>
    </Sentry.ErrorBoundary>
  );
};

export default App;
