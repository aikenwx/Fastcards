import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { flashcard, subject } from "../types";
import { onValue, push, ref } from "firebase/database";
import { stringify } from "querystring";
import NavBar from "./NavBar";
import { addFlashcard } from "../databaseHandlers";
import FlashCard from "./FlashCard";
import { Card } from "react-bootstrap";

export default function Subject() {
  const params = useParams();
  const { currentUser } = useAuth();
  const [cards, setCards]: [flashcard[], any] = useState([]);

  const handleSubmit = () => {
    addFlashcard(
      currentUser.uid,
      params.subjectId || "",
      "test",
      "test",
      "test",
      true,
      true
    );
  };

  useEffect(() => {
    onValue(
      ref(
        db,
        "Users/" +
          currentUser.uid +
          "/Subjects/" +
          params.subjectId +
          "/Flashcards"
      ),
      (snapshot) => {
        const data = snapshot.val();

        if (data !== null) {
          let arr: any[] = [];
          snapshot.forEach((data) => {
            let item = {
              flashcardId: data.key,
              ...data.val(),
            };
            arr.push(item);
          });

          setCards(arr);
        }
      },
    );
  }, []);

  return (
    <>
      <NavBar></NavBar>

      <div>
        {cards.map((card) => (
          <FlashCard {...card} key={card.flashcardId}></FlashCard>
        ))}
      </div>

      <button onClick={handleSubmit}> test </button>
    </>
  );
}
