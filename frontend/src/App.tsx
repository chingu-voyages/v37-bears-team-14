import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./components/formatting/Footer";
import Projects from "./components/projects/Projects";
import MyProjects from "./components/projects/MyProjects";
import AdminOutlet from "./components/routing/AdminOutlet";
import TechListPage from "./components/admin/techs/TechListPage";
import ProjectPageLayout from "./components/project_page/layouts/ProjectPageLayout";
import ProjectLandingPage from "./components/project_page/pages/ProjectLandingPage";
import ProjectApplicationsListPage from "./components/project_page/pages/ProjectApplicationsListPage";
import ProjectSettingsPage from "./components/project_page/pages/ProjectSettingsPage";
import ProjectSearch from "./components/projects/ProjectSearch";
import ProjectSettingsLayout from "./components/project_page/layouts/ProjectSettingsLayout";
import ProjectSettingsTeamPage from "./components/project_page/pages/ProjectSettingsTeamPage";
import ProjectSettingsHooksPage from "./components/project_page/pages/ProjectSettingsHooksPage";
import ProjectApplicationPage from "./components/project_page/pages/ProjectApplicationPage";
import UserPageLayout from "./components/user_page/UserPageLayout";

import ApplicationListPage from "./components/user_applications/pages/ApplicationListPage";
import ApplicationEditPage from "./components/user_applications/pages/ApplicationEditPage";
import DocumentPage from "./components/info/DocumentPage";
import FrontPage from "./components/front_page/FrontPage";

import aboutMdUrl from "./content/about.md";
import teamMdUrl from "./content/team.md";
import privacyMdUrl from "./content/privacy.md";
import termsMdUrl from "./content/terms.md";
import contactMdUrl from "./content/contact.md";
import GraphPage from "./components/explore/GraphPage";

/**
 * App defines the global layout with Navbar and all the application routes.
 */
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/explore" element={<GraphPage />} />
        <Route path="/projects">
          <Route path="" element={<Projects />} />
          <Route path="search" element={<ProjectSearch />} />
          <Route path="my-projects" element={<MyProjects />} />
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
              <Route path="hooks" element={<ProjectSettingsHooksPage />} />
              <Route path="*" element={null} />
            </Route>
            <Route path="*" element={<Navigate to=".." />} />
          </Route>
        </Route>
        <Route path="applications">
          <Route path="" element={<ApplicationListPage />} />
          <Route path=":applicationId" element={<ApplicationEditPage />} />
        </Route>
        <Route path="admin" element={<AdminOutlet />}>
          <Route path="" element={<Navigate to="techs" />} />
          <Route path="techs" element={<TechListPage />} />
          <Route path="*" element={<div className="m-8">Page not found</div>} />
        </Route>
        <Route path="/user">
          <Route path=":username" element={<UserPageLayout />} />
        </Route>
        <Route
          path="/about"
          element={<DocumentPage contentUrl={aboutMdUrl} />}
        />
        <Route path="/team" element={<DocumentPage contentUrl={teamMdUrl} />} />
        <Route
          path="/terms"
          element={<DocumentPage contentUrl={termsMdUrl} />}
        />
        <Route
          path="/privacy"
          element={<DocumentPage contentUrl={privacyMdUrl} />}
        />
        <Route
          path="/contact"
          element={<DocumentPage contentUrl={contactMdUrl} />}
        />
        <Route path="/" element={<FrontPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
