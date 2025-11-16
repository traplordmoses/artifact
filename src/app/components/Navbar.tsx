"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link href="/" className="navbar-logo">
          <Image
            src="/artefact_logo.svg"
            alt="ARtefact"
            width={40}
            height={40}
            priority
          />
          <span className="navbar-brand">artefact</span>
        </Link>
        <div className="navbar-right">
          <div className="navbar-links">
       
          </div>
          <div className="navbar-buttons">
            <a href="https://lens.snap.com/experience/e1fb1a5e-fadd-4735-96e2-c06c728479eb" target="_blank" rel="noopener noreferrer" className="nav-button">AR Camera</a>
            <a href="#" className="nav-button">docs</a>
            <Link href="/console" className="nav-button nav-button-primary">dapp</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
