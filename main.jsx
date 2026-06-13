import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CrushZap from "./CrushZap.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CrushZap />
  </StrictMode>
);
