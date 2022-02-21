import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Projects from "./components/projects/Projects";
import AdminOutlet from "./components/routing/AdminOutlet";
import TechListPage from "./components/admin/techs/TechListPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/projects" element={<Projects />}></Route>
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
