import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import JobList from "../containers/joblist";
import AnalyticsDashboard from "../containers/analytics";
import TechTracker from "../containers/tech_tracker";
import CanonicalTechManager from "../containers/canonical_tech";
import InterviewPrep from "../containers/interview_prep";
import AnswerBank from "../containers/answer_bank";
import ProfileContainer from "../containers/profile";
import Header from "../components/common/header";

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
          <Route path="/canonical-techs" element={<CanonicalTechManager />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/answer-bank" element={<AnswerBank />} />
          <Route path="/profile" element={<ProfileContainer />} />
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

