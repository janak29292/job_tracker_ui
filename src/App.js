// import logo from './logo.svg';
// import './App.css';

import Header from "./components/header";
import JobList from "./containers/joblist";
import ProjectRoutes from "./routes";

function App() {
  return (
    <div className="main-container">

      <Header/>
      <ProjectRoutes/>
      {/* <JobList/> */}
    </div>
  );
}

export default App;
