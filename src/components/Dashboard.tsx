import React, { useState, useEffect } from "react";
import { Alert, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import FlashCard from "./FlashCard";
import NavBar from "./NavBar";
import { db } from "../firebase";
import { onValue, push, ref } from "firebase/database";
import { addSubject } from "../databaseHandlers";
import { subject } from "../types";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { logOut, currentUser } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects]: [subject[], any] = useState([]);

  //read
  useEffect(() => {
    onValue(
      ref(db, "Users/" + currentUser.uid),
      (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          let arr: any[] = [];
          snapshot.forEach((data) => {
            data.forEach((x) => {
              let item = {
                subjectId: x.key,
                ...x.val(),
              };
              arr.push(item);
            });
          });
          setSubjects(arr);
        }
      }
    );
  }, []);

  const test = {
    flashcardId: "testID",
    keyPhrase: "testHello",
    image: "http://placekitten.com/200/200",
    description: "GOOD MORNING",
    isImageVisible: true,
    isDescriptionVisible: true,
  };

  async function handleSubmit() {
    addSubject(currentUser.uid, "test");
  }

  return (
    <>
      <NavBar />
      <div>
        {subjects.map((subject) => (
          <div key={subject.subjectId}>
            <Link to={"subject/" + subject.subjectId}>
              {subject.name}
            </Link>
          </div>
        ))}
      </div>
      <FlashCard {...test} />
      <FlashCard {...test} />
      <button onClick={handleSubmit}>Test</button>
    </>
  );
}
