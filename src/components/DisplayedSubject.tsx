import React from "react";
import { Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { createNewFlashcard } from "../databaseHandlers";
import { displayImageWidth } from "../globalVariables";
import { Subject } from "../types";
import FlashCard from "./FlashCard";

export default function DisplayedSubject(subject: Subject, currentUser: any) {
  const subjectId = subject.subjectId;
  const cards = subject.flashcards;

  const handleAdd = () => {
    try {
      createNewFlashcard(currentUser.uid, subjectId || "", "Untitled");
    } catch (error: any) {
      console.log(error.message);
    }
  };


  return (
    <div>
      <div className="d-flex justify-content-start flex-wrap">
        {cards.map((card) => (
          <FlashCard
            subjectId={subjectId}
            f={card}
            key={card.flashcardId}
          ></FlashCard>
        ))}
        <div className="m-3">
          <Button
            className="add-card-button d-flex flex-row align-items-center"
            as="button"
            onClick={handleAdd}
            style={{
              width: `${displayImageWidth / 5}rem`,
              height: `${displayImageWidth}rem`,
              objectFit: "contain",
            }}
          >
            <Plus size="30" style={{ margin: "0 0 0 0" }}></Plus>
          </Button>
        </div>
      </div>
    </div>
  );
}
