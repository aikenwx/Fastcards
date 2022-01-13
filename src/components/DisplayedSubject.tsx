import React, { useRef, useState } from "react";
import { createNewFlashcard, renameSubject } from "../databaseHandlers";
import FlashCard from "./FlashCard";
import { Button, Container, Card, Form } from "react-bootstrap";
import { displayImageWidth } from "../globalVariables";
import { Plus } from "react-bootstrap-icons";
import { subject } from "../types";

export default function DisplayedSubject(subject: subject, currentUser: any) {
  const subjectId = subject.subjectId;
  const cards = subject.flashcards;
  // const [subjectName, setSubjectName] = useState(subject.name);

  // const formRef: any = useRef();

  const handleAdd = () => {
    try {
      createNewFlashcard(currentUser.uid, subjectId || "", "Untitled");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // const handleNameChange = (e:any) => setSubjectName(e.target.value);
  // const handleBlur = () =>
  //   renameSubject(currentUser.uid, subjectId, subjectName);
  // const handleOnEnter = (e: any) => {
  //   if (e.key == "Enter") {
  //     e.stopPropagation();
  //     e.preventDefault();

  //     if (formRef) {
  //       formRef.current.blur();
  //     }
  //   }
  // };

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
