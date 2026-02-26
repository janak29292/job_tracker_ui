import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import JobList from "../containers/joblist";
import AnalyticsDashboard from "../containers/analytics";
import TechTracker from "../containers/tech_tracker";
import InterviewPrep from "../containers/interview_prep";
import AnswerBank from "../containers/answer_bank";
import Header from "../components/header";

// Inner component that has access to useLocation
const AppRoutes = () => {
  const location = useLocation();
  const isJobListActive = location.pathname === '/';

  return (
    <>
      {/* JobList stays mounted, just hidden when not active - preserves state! */}
      <div style={{ display: isJobListActive ? 'block' : 'none' }}>
        <JobList />
      </div>

      {/* Other routes mount/unmount normally */}
      {!isJobListActive && (
        <Routes>
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/tech-tracker" element={<TechTracker />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/answer-bank" element={<AnswerBank />} />
        </Routes>
      )}
    </>
  );
};

// Switch between one screen to another screen
const ProjectRoutes = () => (
  <BrowserRouter>
    <Header />
    <AppRoutes />
  </BrowserRouter>
);

// default importing
export default ProjectRoutes;

