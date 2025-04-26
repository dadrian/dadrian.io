import React from "react";
import ReactDOM from "react-dom/client";
import { AAAByYear, AAAPlatforms, GameCountsByYear, LateStageFranchiseAbsolute, LateStageFranchiseFraction, OpenWorldAbsolute, OpenWorldFraction, RatingsByYear } from "./games";

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

  const openWorldAbsoluteMountPoint = document.getElementById("open-world-absolute-by-year");
  if (openWorldAbsoluteMountPoint) {
    ReactDOM.createRoot(openWorldAbsoluteMountPoint).render(<OpenWorldAbsolute />);
  }

  const openWorldFractionMountPoint = document.getElementById("open-world-fraction-by-year");
  if (openWorldFractionMountPoint) {
    ReactDOM.createRoot(openWorldFractionMountPoint).render(<OpenWorldFraction />);
  }

  const franchiseAbsoluteMountPoint = document.getElementById("franchise-absolute-by-year");
  if (franchiseAbsoluteMountPoint) {
    ReactDOM.createRoot(franchiseAbsoluteMountPoint).render(<LateStageFranchiseAbsolute />);
  }

  const franchiseFractionMountPoint = document.getElementById("franchise-fraction-by-year");
  if (franchiseFractionMountPoint) {
    ReactDOM.createRoot(franchiseFractionMountPoint).render(<LateStageFranchiseFraction />);
  }

  const ratingsMountPoint = document.getElementById("ratings-by-year");
  if (ratingsMountPoint) {
    ReactDOM.createRoot(ratingsMountPoint).render(<RatingsByYear />);
  }
});
