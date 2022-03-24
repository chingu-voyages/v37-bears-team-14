import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SessionProvider } from "./hooks/session";
import ProjectProvider from "./store/projectProvider";
import { NotificationProvider } from "./components/notifications_page/useNotifications";

ReactDOM.render(
  <React.StrictMode>
    <SessionProvider>
      <NotificationProvider>
        <ProjectProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ProjectProvider>
      </NotificationProvider>
    </SessionProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
