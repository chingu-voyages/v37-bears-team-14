import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Projects from "./components/projects/Projects";
import AdminOutlet from "./components/routing/AdminOutlet";
import TechListPage from "./components/admin/techs/TechListPage";
import ProjectPage from "./components/project_page/ProjectPage";
import ProjectLandingPage from "./components/project_page/ProjectLandingPage";
import ProjectSettingsPage from "./components/project_page/ProjectSettingsPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/projects">
          <Route path="" element={<Projects />} />
          <Route path=":projectId" element={<ProjectPage />}>
            <Route path="" element={<ProjectLandingPage />} />
            <Route path="settings" element={<ProjectSettingsPage />} />
          </Route>

          {/* <Route path=":projectId" element={<ProjectPage />} />
          <Route path=":projectId/settings" element={<ProjectPage />} /> */}
        </Route>
        <Route path="admin" element={<AdminOutlet />}>
          <Route path="" element={<Navigate to="techs" />} />
          <Route path="techs" element={<TechListPage />} />
          <Route path="*" element={<div className="m-8">Page not found</div>} />
        </Route>
        <Route path="/" element={null} />
      </Routes>
      <div className="flex"></div>
    </>
  );
}

export default App;
