import { BrowserRouter, Route, Routes } from "react-router-dom";
import Placeholder from "../containers/placeholder";
import JobList from "../containers/joblist";

// Switch between one screen to another screen
const ProjectRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/placeholder" element={<Placeholder />} />
      <Route path="/" element={<JobList />} />
    </Routes>
  </BrowserRouter>
);
// default importing
export default ProjectRoutes;
