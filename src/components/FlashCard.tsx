import React, { useState } from "react";
import { editFlashcard, deleteFlashcard } from "../databaseHandlers";
import { ThreeDots } from "react-bootstrap-icons";
import { flashcard } from "../types";
import { useAuth } from "../contexts/AuthContext";
import "../styles/dropdown.css";
import {
  Dropdown,
  Form,
  ButtonGroup,
  Modal,
  Button,
  Card,
} from "react-bootstrap";

export default function FlashCard({
  f,
  subjectId,
}: {
  f: flashcard;
  subjectId: string;
}) {
  const { currentUser } = useAuth();
  const [keyPhrase, setKeyPhrase]: any = useState(f.keyPhrase);
  const [description, setDescription]: any = useState(f.description);
  const [image, setImage]: any = useState(f.image);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleSave = () => {
    const updatedFlashcard: flashcard = {
      ...f,
    };

    updatedFlashcard.image = image;
    updatedFlashcard.description = description;
    updatedFlashcard.keyPhrase = keyPhrase;

    editFlashcard(currentUser.uid, subjectId, updatedFlashcard);
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const handleToggleDescription = () => {
    const updatedFlashcard: flashcard = {
      ...f,
    };
    updatedFlashcard.isDescriptionVisible =
      !updatedFlashcard.isDescriptionVisible;
    editFlashcard(currentUser.uid, subjectId, updatedFlashcard);
  };

  const handleToggleImage = () => {
    const updatedFlashcard: flashcard = {
      ...f,
    };
    updatedFlashcard.isImageVisible = !updatedFlashcard.isImageVisible;
    editFlashcard(currentUser.uid, subjectId, updatedFlashcard);
  };

  return (
    <div className="container mt-3">
      <Card className="card" style={{ width: "18rem" }} onClick={handleShow}>
        <div className="card-body">
          <div className="card-title">{f.keyPhrase}</div>
          {f.isDescriptionVisible && (
            <p className="card-text">{f.description}</p>
          )}
          {f.isImageVisible && f.image && (
            <img className="card-img-bottom" src={f.image} />
          )}
        </div>
      </Card>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Form.Control
            className="m-2"
            defaultValue={f.keyPhrase}
            style={{ border: 0, fontSize: 30 }}
            onChange={(e) => setKeyPhrase(e.target.value)}
          />
          <Dropdown align={"end"}>
            <Dropdown.Toggle
              id="dropdown-basic"
              variant="light"
            >
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {f.description && <Dropdown.Item
                href="#/action-1"
                onClick={handleToggleDescription}
              >
                Toggle Description
              </Dropdown.Item>}

              {f.image && <Dropdown.Item href="#/action-2" onClick={handleToggleImage}>
                Toggle Image
              </Dropdown.Item>}
              <Dropdown.Item
                href="#/action-3"
                onClick={() =>
                  deleteFlashcard(currentUser.uid, subjectId, f.flashcardId)
                }
              >
                Delete Flashcard
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            className={"mb-2"}
            defaultValue={f.description}
            style={{ border: 0, display: "inline-block" }}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for this keyword"
          ></Form.Control>
          <Form.Control
            defaultValue={f.image}
            style={{ border: 0 }}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Add an image URL"
          ></Form.Control>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
