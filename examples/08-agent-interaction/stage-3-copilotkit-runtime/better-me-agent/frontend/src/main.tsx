import React from "react";
import ReactDOM from "react-dom/client";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import "./styles.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CopilotKit
      runtimeUrl="http://localhost:8001/copilotkit"
      runtimeTransport="single"
    >
      <App />
    </CopilotKit>
  </React.StrictMode>,
);
