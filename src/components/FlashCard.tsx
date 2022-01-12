import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { editFlashcard, deleteFlashcard } from "../databaseHandlers";
import {
  Crop,
  flashcard,
  ImageKey,
  ImageConfig,
  ImageDimensions,
} from "../types";
import { useAuth } from "../contexts/AuthContext";
import {
  Dropdown,
  Form,
  Modal,
  Button,
  Card,
  Alert,
  Container,
} from "react-bootstrap";
import { deleteImage, uploadImageAndUpdateFlashcard } from "../storageHandlers";
import {
  checkFileIsImage,
  checkValidFileSize,
  getHeightAndWidthFromDataUrl,
} from "../helperFunctions";
import {
  displayImageWidth,
  imageSizeLimit,
  blankImageConfig,
} from "../globalVariables";
import ImageDropContainer from "./ImageDropContainer";
import FlashcardImage from "./FlashcardImage";

export default function FlashCard({
  f,
  subjectId,
}: {
  f: flashcard;
  subjectId: string;
}) {
  const uuid = require("uuid");
  const uuidv4 = uuid.v4;

  const { currentUser } = useAuth();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(true);
  const [textScrollHeight, setTextScrollHeight] = useState(38);
  const [showCropper, setShowCropper] = useState(false);

  const [keyPhrase, setKeyPhrase]: any = useState(f.keyPhrase);
  const [description, setDescription]: any = useState(f.description);

  const [crop, setCrop]: [Crop, any] = useState({
    x: f.translateX,
    y: f.translateY,
  });
  const [imageKey, setImageKey]: [ImageKey, any] = useState({ ...f });
  const [scale, setScale] = useState(f.scale);
  const [rotation, setRotation] = useState(f.rotation);
  const [imageDimensions, setImageDimensions]: [ImageDimensions, any] =
    useState({ ...f });
  const [imageFile, setImageFile]: any = useState();

  const textAreaRef: any = useRef();
  // reset data once modal flashcard is closed
  useEffect(
    () => setIsSaved(false),
    [
      keyPhrase,
      description,
      imageKey,
      scale,
      crop,
      rotation,
      imageDimensions,
      imageFile,
    ]
  );

  useEffect(() => {
    if (textAreaRef.current) {
      setTextScrollHeight(textAreaRef.current.scrollHeight + 2);
    }
  }, [show]);

  const imageConfig: ImageConfig = {
    ...imageKey,
    ...imageDimensions,
    scale: scale,
    rotation: rotation,
    translateX: crop.x,
    translateY: crop.y,
  };

  const setImageConfig = (imageConfig: ImageConfig) => {
    setImageKey({ ...imageConfig });
    setImageDimensions({ ...imageConfig });
    setRotation(imageConfig.rotation);
    setScale(imageConfig.scale);
    setCrop({ x: imageConfig.translateX, y: imageConfig.translateY });
  };

  const handleClose = () => {
    setShow(false);
    setError("");
    setKeyPhrase(f.keyPhrase);
    setDescription(f.description);
    setImageFile();
    setImageConfig({ ...f });
    setShowCropper(false);
  };
  const handleSave = () => {
    const updatedFlashcard: flashcard = {
      ...f,
      ...imageConfig,
    };

    updatedFlashcard.description = description;
    updatedFlashcard.keyPhrase = keyPhrase;

    // previous image id is deleted
    if (f.imageId && !updatedFlashcard.imageId) {
      deleteImage(f);
      editFlashcard(currentUser.uid, subjectId, updatedFlashcard);
      setIsSaved(true);
      return;
    }
    // original and updated imageIds are not the same
    else if (f.imageId !== updatedFlashcard.imageId) {
      uploadImageAndUpdateFlashcard(
        currentUser.uid,
        subjectId,
        imageFile,
        f,
        updatedFlashcard
      );
      setIsSaved(true);

      return;
    }

    editFlashcard(currentUser.uid, subjectId, updatedFlashcard);
    setIsSaved(true);
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
    setError("");
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
    const updatedImageConfig = { ...imageConfig };

    const url = URL.createObjectURL(file);
    const imageId = uuidv4();

    getHeightAndWidthFromDataUrl(url).then((dimensions: any) => {
      updatedImageConfig.imageHeight = dimensions.height;
      updatedImageConfig.imageWidth = dimensions.width;
      updatedImageConfig.imageId = imageId;
      updatedImageConfig.imageUrl = url;
      setImageConfig(updatedImageConfig);
      setImageFile(file);
    });
  };
  console.log(f.description);
  const handleDeleteImage = () => {
    setImageConfig({ ...blankImageConfig });
    setImageFile();
  };
  return (
    <Container className="m-3">
      <Card
        className="card"
        style={{ width: `${displayImageWidth}rem`, overflow: "hidden", minHeight: `${displayImageWidth}rem`}}
        onClick={handleShow}
      >
        {f.isImageVisible &&
          f.imageUrl &&
          FlashcardImage({ ...f }, displayImageWidth)}
        {(f.keyPhrase || (f.isDescriptionVisible && f.description)) && (
          <Card.Body>
            <Card.Title>{f.keyPhrase}</Card.Title>
            {f.isDescriptionVisible && (
              <Card.Text style={{ whiteSpace: "normal" }}>
                {" "}
                {f.description}
              </Card.Text>
            )}
          </Card.Body>
        )}
      </Card>
      <Modal show={show} onExited={handleClose} onShow={() => setIsSaved(true)}>
        <Modal.Header>
          <Form.Control
            className="m-2"
            placeholder="Add a key phrase"
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
            ref={textAreaRef}
            as="textarea"
            className={"mb-2"}
            defaultValue={f.description}
            style={{ height: textScrollHeight }}
            onChange={(e) => {
              setTextScrollHeight(e.target.scrollHeight + 2);
              setDescription(e.target.value);
            }}
            placeholder="Add a description"
          ></Form.Control>
          {error && <Alert variant="danger">{error}</Alert>}
          {ImageDropContainer(
            imageConfig,
            crop,
            scale,
            rotation,
            showCropper,
            setShowCropper,
            setCrop,
            setRotation,
            setScale,
            handleImageChange,
            handleDeleteImage
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" disabled={isSaved} onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
