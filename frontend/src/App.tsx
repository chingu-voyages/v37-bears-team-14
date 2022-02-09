import React from "react";
import Hello from "./Hello";
import Navbar from "./Navbar";

function App() {
  return (
    <>
      <Navbar
        username="Bill"
        avatarURL="https://s3-us-east-2.amazonaws.com/maryville/wp-content/uploads/2020/01/20133422/software-developer-coding-500x333.jpg"
      />
      <div className="flex">
        <div className="border-2 border-stone-500 p-8 m-12 rounded-md">
          <Hello />
        </div>
      </div>
    </>
  );
}

export default App;
