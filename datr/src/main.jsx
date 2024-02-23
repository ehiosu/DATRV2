import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AxiosClient } from "./api/useAxiosClient.jsx";
import { Toaster } from "./components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AxiosClient>
      <App />
    </AxiosClient>
    <Toaster />
  </React.StrictMode>
);
