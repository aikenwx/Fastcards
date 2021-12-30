import React from "react";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <a href="/" className="navbar-brand">
        FastCards
      </a>
      {/* <button className="navbar-toggler">
        <span className="navbar-toggler-icon"></span>
      </button> */}
      <ul className="navbar-nav">
        <li className="nav-item>">
          <a href="/update-profile" className="nav-link">
            Update Profile
          </a>
        </li>
      </ul>
    </nav>
  );
}
