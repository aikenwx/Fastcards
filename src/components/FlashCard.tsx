import React, { useState, useEffect } from "react";
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
  Image,
} from "react-bootstrap";
import { deleteImage, uploadImage } from "../storageHandlers";
import { checkFileIsImage, checkValidFileSize } from "../helperFunctions";
import { imageSizeLimit } from "../globalVariables";
import ImageDropContainer from "./ImageDropContainer";

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
  const [imageUrl, setImageUrl]: any = useState(f.imageUrl);

  const [show, setShow] = useState(false);
  const [imageFile, setImageFile]: any = useState();
  const [previewImageUrl, setPreviewImageUrl]: [string, any] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    setPreviewImageUrl("");
    setImageUrl(f.imageUrl);
    setImageFile();
  }, [show]);

  const handleSave = () => {
    const updatedFlashcard: flashcard = {
      ...f,
    };
    updatedFlashcard.description = description;
    updatedFlashcard.keyPhrase = keyPhrase;
    updatedFlashcard.imageUrl = imageUrl;

    if (!imageUrl && updatedFlashcard.imageId && !previewImageUrl) {
      deleteImage(currentUser.uid, subjectId, updatedFlashcard);
      return;
    } else if (imageFile) {
      uploadImage(currentUser.uid, subjectId, imageFile, updatedFlashcard);
      return;
    }

    editFlashcard(currentUser.uid, subjectId, updatedFlashcard);
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

  const handleImageChange = (file: any) => {
    if (!file) {
      setError("The submitted item is not a valid file");
      return;
    } else if (!checkFileIsImage(file)) {
      setError("The submitted file is not an image");
      return;
    } else if (!checkValidFileSize(file)) {
      setError(
        "The submitted image must be less than " + imageSizeLimit + " MB"
      );
      return;
    }

    setPreviewImageUrl(URL.createObjectURL(file));
    setImageFile(file);
  };

  const handleDeleteImage = () => {
    setPreviewImageUrl("");
    setImageUrl("");
    setImageFile();
  };

  return (
    <div className="container mt-3">
      <Card className="card" style={{ width: "18rem" }} onClick={handleShow}>
        <div className="card-body">
          <div className="card-title">{f.keyPhrase}</div>
          {f.isDescriptionVisible && (
            <p className="card-text">{f.description}</p>
          )}
          {f.isImageVisible && f.imageUrl && (
            <img className="card-img-bottom" src={f.imageUrl} />
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
            ></Dropdown.Toggle>

            <Dropdown.Menu>
              {f.description && (
                <Dropdown.Item
                  href="#/action-1"
                  onClick={handleToggleDescription}
                >
                  Toggle Description
                </Dropdown.Item>
              )}

              {f.imageUrl && (
                <Dropdown.Item href="#/action-2" onClick={handleToggleImage}>
                  Toggle Image
                </Dropdown.Item>
              )}
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
          {ImageDropContainer(
            previewImageUrl || imageUrl,
            handleImageChange,
            handleDeleteImage
          )}
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
