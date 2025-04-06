import React from "react";
import ReactDOM from "react-dom/client";
import Graph from "./graph";
import AAAPlatforms from "./games";

document.addEventListener("DOMContentLoaded", () => {
  const mountPoint = document.getElementById("graph-root");
  if (mountPoint) {
    ReactDOM.createRoot(mountPoint).render(<Graph />);
  }

  const aaaTableMountPoint = document.getElementById("aaa-platforms");
  if (aaaTableMountPoint) {
    ReactDOM.createRoot(aaaTableMountPoint).render(<AAAPlatforms />);
  }
});
