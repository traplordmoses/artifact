"use client";

import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <Image
            src="/artefact_logo.svg"
            alt="ARtefact"
            width={40}
            height={40}
            priority
          />
          <span className="navbar-brand">artefact</span>
        </div>
        <div className="navbar-right">
          <div className="navbar-links">
       
          </div>
          <div className="navbar-buttons">
            <a href="#" className="nav-button">docs</a>
            <a href="#" className="nav-button nav-button-primary">dapp</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

