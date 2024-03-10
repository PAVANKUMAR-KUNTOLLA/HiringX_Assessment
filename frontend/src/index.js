import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";


const root = createRoot(document.getElementById("root")); // Use createRoot instead of ReactDOM.render
root.render(
  <React.StrictMode>
   <GoogleOAuthProvider clientId="856575485974-geackfklc5stveqer9fsk8fd0tqdnl4e.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();


