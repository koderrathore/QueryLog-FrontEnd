import React, { useState } from "react";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`px-4 md:px-12 lg:px-32 ${menuOpen ? "max-h-dvh overflow-hidden" : ""}`}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Outlet />
    </div>
  );
};

export default MainLayout;
