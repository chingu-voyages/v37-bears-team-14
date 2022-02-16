import React from "react";
import { Route, Routes } from "react-router-dom";
import Hello from "./Hello";
import Navbar from "./Navbar";
import Projects from "./components/projects/Projects";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/projects" element={<Projects />}></Route>
      </Routes>
      <div className="flex"></div>
    </>
  );
}

export default App;
