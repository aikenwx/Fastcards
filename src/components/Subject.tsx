import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  Button, Card, Container
} from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  createNewFlashcard
} from "../databaseHandlers";
import { db } from "../firebase";
import { displayImageWidth } from "../globalVariables";
import { Flashcard } from "../types";
import FlashCard from "./FlashCard";
import NavBar from "./NavBar";

export default function Subject() {
  const params = useParams();
  const { currentUser } = useAuth();
  const [cards, setCards]: [Flashcard[], any] = useState([]);
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
      <Container>
        <div>
          {cards.map((card) => (
            <FlashCard
              subjectId={subjectId}
              f={card}
              key={card.flashcardId}
            ></FlashCard>
          ))}
        </div>
        <Container className="m-3">
          <Button
            className="add-card-button d-flex flex-row align-items-center"
            as="button"
            onClick={handleAdd}
            style={{
              width: `${displayImageWidth}rem`,
              height: `${displayImageWidth / 5}rem`,
              objectFit: "contain",
            }}
          >
            <Card.Title style={{ margin: "0 0 0 0" }}>New Flashcard</Card.Title>
            <Plus size="30" style={{ margin: "0 0 0 0" }}></Plus>
          </Button>
        </Container>
      </Container>
    </>
  );
}
