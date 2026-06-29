import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./shared/design-system/theme.css";
import "./shared/design-system/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
