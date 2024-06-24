import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
import { app as App } from "./v3/app.tsx";
import "./index.css";
import { AxiosClient } from "./api/useAxiosClient.jsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { Toaster as SonnerToaster } from "sonner";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AxiosClient>
      <App />
    </AxiosClient>
    <SonnerToaster />
    <Toaster />
  </React.StrictMode>
);
