import React, { useState } from "react";
import { Alert, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import FlashCard from "./FlashCard";
import NavBar from "./NavBar";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { logOut, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");

    try {
      await logOut();
      navigate("/login");
    } catch (exception: any) {
      setError(exception.message);
    }
  }

  const test = {
    keyPhrase: "testHello",
    image: "http://placekitten.com/200/200",
    description: "GOOD MORNING",
    isImageVisible: true,
    isDescriptionVisible: true,
  };

  return (
    <>
      <NavBar />
      <div></div>
      <FlashCard {...test}/>
      <FlashCard {...test}/>
    </>
  );
}
