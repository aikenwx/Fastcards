import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { logOut } = useAuth();

  async function handleLogout() {
    try {
      await logOut();
    } catch (exception: any) {
      console.log(exception.message)
    }
  }

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <a href="/" className="navbar-brand">
        FastCards
      </a>
      {/* <button className="navbar-toggler">
        <span className="navbar-toggler-icon"></span>
      </button> */}
      <ul className="navbar-nav mr-auto">
        <li className="nav-item>">
          <a href="/update-profile" className="nav-link">
            Update Profile
          </a>
        </li>
      </ul>
      <ul className="navbar-nav my-2 my-lg-0">
        <li className="nav-item">
          <a className="nav-link" href="/login" onClick={handleLogout}>
            {" "}
            Log Out{" "}
          </a>
        </li>
      </ul>
    </nav>
  );
}
