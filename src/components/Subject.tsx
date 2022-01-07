import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { flashcard, subject } from "../types";
import { onValue, push, ref } from "firebase/database";
import { stringify } from "querystring";
import NavBar from "./NavBar";
import { addFlashcard, deleteFlashcard } from "../databaseHandlers";
import FlashCard from "./FlashCard";
import { Card } from "react-bootstrap";

export default function Subject() {
  const params = useParams();
  const { currentUser } = useAuth();
  const [cards, setCards]: [flashcard[], any] = useState([]);

  const handleSubmit = () => {
    try {
      addFlashcard(
        currentUser.uid,
        params.subjectId || "",
        "test",
        "test",
        "test",
        true,
        true
      );
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleDelete = (flashcardId: string) => {
    try {
      deleteFlashcard(currentUser.uid, params.subjectId || "", flashcardId);
    } catch (error: any) {
      console.log(error.message);
    }
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
      }
    );
  }, []);

  return (
    <>
      <NavBar></NavBar>

      <div>
        {cards.map((card) => (
          <FlashCard f={card} deleteHandler={handleDelete} key={card.flashcardId}></FlashCard>
        ))}
      </div>

      <button onClick={handleSubmit}> add flashcard </button>
    </>
  );
}
