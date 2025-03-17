import React from "react";
import ReactDOM from "react-dom/client";
import Graph from "./graph";

document.addEventListener("DOMContentLoaded", () => {
  const mountPoint = document.getElementById("graph-root");
  if (mountPoint) {
    ReactDOM.createRoot(mountPoint).render(<Graph />);
  }
});
