import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Projects from "./components/projects/Projects";
import AdminOutlet from "./components/routing/AdminOutlet";
import TechListPage from "./components/admin/techs/TechListPage";
import ProjectPageLayout from "./components/project_page/layouts/ProjectPageLayout";
import ProjectLandingPage from "./components/project_page/pages/ProjectLandingPage";
import ProjectApplicationsListPage from "./components/project_page/pages/ProjectApplicationsListPage";
import ProjectSettingsPage from "./components/project_page/pages/ProjectSettingsPage";
import ProjectSettingsLayout from "./components/project_page/layouts/ProjectSettingsLayout";
import ProjectSettingsTeamPage from "./components/project_page/pages/ProjectSettingsTeamPage";
import ProjectApplicationPage from "./components/project_page/pages/ProjectApplicationPage/index";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/projects">
          <Route path="" element={<Projects />} />
          <Route path=":projectId" element={<ProjectPageLayout />}>
            <Route path="" element={<ProjectLandingPage />} />
            <Route
              path="applications/:applicationId"
              element={<ProjectApplicationPage />}
            />
            <Route
              path="applications"
              element={<ProjectApplicationsListPage />}
            />
            <Route path="settings" element={<ProjectSettingsLayout />}>
              <Route path="" element={<Navigate to="project" />} />
              <Route path="project" element={<ProjectSettingsPage />} />
              <Route path="team" element={<ProjectSettingsTeamPage />} />
              <Route path="*" element={null} />
            </Route>
            <Route path="*" element={<Navigate to=".." />} />
          </Route>
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
