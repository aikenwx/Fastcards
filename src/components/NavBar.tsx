import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { logOut } = useAuth();

  async function handleLogout() {
    try {
      await logOut();
    } catch (exception: any) {
      console.log(exception.message);
    }
  }

  return (
    <Navbar
      className="flex-md-nowrap p-0"
      fixed="top"
      collapseOnSelect
   
      bg="dark"
      variant="dark"
    >
      <Navbar.Brand className="col-md-3 col-lg-4 me-0 px-4" href="/">
        FastCards
      </Navbar.Brand>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto"></Nav>
        <Nav>
          <Nav.Link href="/update-profile">Update Profile</Nav.Link>
          <Nav.Link href="/login" onClick={handleLogout}>
            Log Out
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
