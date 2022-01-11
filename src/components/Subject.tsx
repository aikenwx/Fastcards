import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { flashcard } from "../types";
import { onValue, ref } from "firebase/database";
import NavBar from "./NavBar";
import {
  createNewFlashcard,
  deleteFlashcard,
  editFlashcard,
} from "../databaseHandlers";
import FlashCard from "./FlashCard";
import { Button, Container } from "react-bootstrap";

export default function Subject() {
  const params = useParams();
  const { currentUser } = useAuth();
  const [cards, setCards]: [flashcard[], any] = useState([]);
  const subjectId = params.subjectId || "";

  const handleAdd = () => {
    try {
      createNewFlashcard(currentUser.uid, params.subjectId || "", "Untitled");
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
        } else {
          setCards([]);
        }
      }
    );
  }, []);

  return (
    <>
      <NavBar></NavBar>

      <div>
        {cards.map((card) => (
          <FlashCard
            subjectId={subjectId}
            f={card}
            key={card.flashcardId}
          ></FlashCard>
        ))}
      </div>
      <Container className="mt-3">
        <Button onClick={handleAdd}> Add Flashcard </Button>
      </Container>
    </>
  );
}
