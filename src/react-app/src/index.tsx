import React from "react";
import ReactDOM from "react-dom/client";
import { AAAByYear, AAAPlatforms, GameCountsByYear } from "./games";

document.addEventListener("DOMContentLoaded", () => {
  const aaaTableMountPoint = document.getElementById("aaa-platforms");
  if (aaaTableMountPoint) {
    ReactDOM.createRoot(aaaTableMountPoint).render(<AAAPlatforms />);
  }

  const gameCategorizationByYearMountPoint = document.getElementById("game-categorization-by-year");
  if (gameCategorizationByYearMountPoint) {
    ReactDOM.createRoot(gameCategorizationByYearMountPoint).render(<GameCountsByYear />);
  }

  const aaaByYearMountPoint = document.getElementById("aaa-by-year");
  if (aaaByYearMountPoint) {
    ReactDOM.createRoot(aaaByYearMountPoint).render(<AAAByYear />);
  }
});
