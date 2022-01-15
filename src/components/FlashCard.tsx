import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Dropdown, Form, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { deleteFlashcard, editFlashcard } from "../databaseHandlers";
import {
  blankImageProps,
  displayImageWidth,
  imageSizeLimit,
} from "../globalVariables";
import {
  checkFileIsImage,
  checkValidFileSize,
  getHeightAndWidthFromDataUrl,
} from "../helperFunctions";
import {
  deleteBackImage,
  deleteFrontImage,
  uploadBackImageAndUpdateFlashcard,
  uploadFrontImageAndUpdateFlashcard,
} from "../storageHandlers";
import {
  Crop,
  Flashcard,
  ImageDimensions,
  ImageKey,
  ImageProps,
  Subject,
} from "../types";
import FlashcardImage from "./FlashcardImage";
import ImageDropContainer from "./ImageDropContainer";

export default function FlashCard({
  f,
  subject,
}: {
  f: Flashcard;
  subject: Subject;
}) {
  const subjectId = subject.subjectId;

  const uuid = require("uuid");
  const uuidv4 = uuid.v4;

  const { currentUser } = useAuth();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(true);

  const [flashcardName, setFlashcardName]: any = useState(f.flashcardName);

  const [frontTextScrollHeight, setFrontTextScrollHeight] = useState(38);
  const [showFrontCropper, setShowFrontCropper] = useState(false);

  const [backTextScrollHeight, setBackTextScrollHeight] = useState(38);
  const [showBackCropper, setShowBackCropper] = useState(false);

  const [frontText, setFrontText]: any = useState(f.frontText);
  const [frontCrop, setFrontCrop]: [Crop, any] = useState({
    x: f.frontImageProps.translateX,
    y: f.frontImageProps.translateY,
  });
  const [frontImageKey, setFrontImageKey]: [ImageKey, any] = useState({
    imageId: f.frontImageId,
    imageUrl: f.frontImageUrl,
  });
  const [frontScale, setFrontScale] = useState(f.frontImageProps.scale);
  const [frontRotation, setFrontRotation] = useState(
    f.frontImageProps.rotation
  );
  const [frontImageDimensions, setFrontImageDimensions]: [
    ImageDimensions,
    any
  ] = useState({ ...f.frontImageProps });
  const [frontImageFile, setFrontImageFile]: any = useState();

  const [backText, setBackText]: any = useState(f.backText);
  const [backCrop, setBackCrop]: [Crop, any] = useState({
    x: f.backImageProps.translateX,
    y: f.backImageProps.translateY,
  });
  const [backImageKey, setBackImageKey]: [ImageKey, any] = useState({
    imageId: f.backImageId,
    imageUrl: f.backImageUrl,
  });
  const [backScale, setBackScale] = useState(f.frontImageProps.scale);
  const [backRotation, setBackRotation] = useState(f.backImageProps.rotation);
  const [backImageDimensions, setBackImageDimensions]: [ImageDimensions, any] =
    useState({ ...f.backImageProps });
  const [backImageFile, setBackImageFile]: any = useState();

  const textAreaRef: any = useRef();
  // reset data once modal flashcard is closed
  useEffect(
    () => setIsSaved(false),
    [
      flashcardName,
      frontText,
      frontImageKey,
      frontScale,
      frontCrop,
      frontRotation,
      frontImageDimensions,
      frontImageFile,
      backText,
      backImageKey,
      backScale,
      backCrop,
      backRotation,
      backImageDimensions,
      backImageFile,
    ]
  );

  useEffect(() => {
    if (textAreaRef.current) {
      setFrontTextScrollHeight(textAreaRef.current.scrollHeight + 2);
    }
  }, [show]);

  const frontImageProps: ImageProps = {
    ...frontImageDimensions,
    scale: frontScale,
    rotation: frontRotation,
    translateX: frontCrop.x,
    translateY: frontCrop.y,
  };

  const setFrontImageProps = (frontImageProps: ImageProps) => {
    setFrontImageDimensions({ ...frontImageProps });
    setFrontRotation(frontImageProps.rotation);
    setFrontScale(frontImageProps.scale);
    setFrontCrop({
      x: frontImageProps.translateX,
      y: frontImageProps.translateY,
    });
  };

  const backImageProps: ImageProps = {
    ...backImageDimensions,
    scale: backScale,
    rotation: backRotation,
    translateX: backCrop.x,
    translateY: backCrop.y,
  };

  const setBackImageProps = (backImageProps: ImageProps) => {
    setBackImageDimensions({ ...backImageProps });
    setBackRotation(backImageProps.rotation);
    setBackScale(backImageProps.scale);
    setBackCrop({ x: backImageProps.translateX, y: backImageProps.translateY });
  };

  const handleClose = () => {
    setShow(false);
    setError("");
    setFlashcardName(f.flashcardName);
    setFrontText(f.frontText);
    setBackText(f.backText);
    setFrontImageFile();
    setBackImageFile();
    setFrontImageKey({ imageUrl: f.frontImageUrl, imageId: f.frontImageUrl });
    setBackImageKey({ imageUrl: f.backImageUrl, imageId: f.backImageUrl });
    setFrontImageProps({ ...f.frontImageProps });
    setBackImageProps({ ...f.backImageProps });
    setShowFrontCropper(false);
    setShowBackCropper(false);
  };

  const handleSave = () => {
    const updatedFlashcard: Flashcard = {
      ...f,
      flashcardName: flashcardName,
      frontText: frontText,
      frontImageId: frontImageKey.imageId,
      frontImageUrl: frontImageKey.imageUrl,
      frontImageProps: frontImageProps,
      backImageId: backImageKey.imageId,
      backImageUrl: backImageKey.imageUrl,
      backImageProps: backImageProps,
    };

    // previous front image id is deleted
    if (f.frontImageId && !updatedFlashcard.frontImageId) {
      deleteFrontImage(f);

      if (f.backImageId && !updatedFlashcard.backImageId) {
        deleteBackImage(f);
      }
      editFlashcard(currentUser.uid, subjectId, updatedFlashcard);
      setIsSaved(true);
      return;
    } else if (f.backImageId && !updatedFlashcard.backImageId) {
      deleteBackImage(f);
      editFlashcard(currentUser.uid, subjectId, updatedFlashcard);
      setIsSaved(true);
      return;
    }
    // original and updated frontImageIds are not the same
    else if (f.frontImageId !== updatedFlashcard.frontImageId) {
      uploadFrontImageAndUpdateFlashcard(
        currentUser.uid,
        subjectId,
        frontImageFile,
        f,
        updatedFlashcard
      );
      if (f.frontImageId !== updatedFlashcard.frontImageId) {
        uploadBackImageAndUpdateFlashcard(
          currentUser.uid,
          subjectId,
          backImageFile,
          f,
          updatedFlashcard
        );
      }

      setIsSaved(true);
      return;
    } else if (f.frontImageId !== updatedFlashcard.frontImageId) {
      uploadBackImageAndUpdateFlashcard(
        currentUser.uid,
        subjectId,
        backImageFile,
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

  const handleFrontImageChange = (file: any) => {
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
    const updatedFrontImageProps = { ...f.frontImageProps };

    const url = URL.createObjectURL(file);
    const imageId = uuidv4();

    getHeightAndWidthFromDataUrl(url).then((dimensions: any) => {
      updatedFrontImageProps.imageHeight = dimensions.height;
      updatedFrontImageProps.imageWidth = dimensions.width;
      setFrontImageKey({ imageId: imageId, imageUrl: url });
      setFrontImageProps(updatedFrontImageProps);
      setFrontImageFile(file);
    });
  };

  const handleBackImageChange = (file: any) => {
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
    const updatedBackImageProps = { ...f.backImageProps };

    const url = URL.createObjectURL(file);
    const imageId = uuidv4();

    getHeightAndWidthFromDataUrl(url).then((dimensions: any) => {
      updatedBackImageProps.imageHeight = dimensions.height;
      updatedBackImageProps.imageWidth = dimensions.width;
      setBackImageKey({ imageId: imageId, imageUrl: url });
      setBackImageProps(updatedBackImageProps);
      setBackImageFile(file);
    });
  };

  const handleDeleteFrontImage = () => {
    setFrontImageKey({ imageId: "", imageUrl: "" });
    setFrontImageProps({ ...blankImageProps });
    setFrontImageFile();
  };

  const handleDeleteBackImage = () => {
    setBackImageKey({ imageId: "", imageUrl: "" });
    setBackImageProps({ ...blankImageProps });
    setBackImageFile();
  };

  return (
    <div className="m-3">
      <div
        className="clickable-card"
        onClick={handleShow}
        style={{ width: `${displayImageWidth}rem` }}
      >
        <Card
          className="card"
          style={{
            width: `${displayImageWidth}rem`,
            overflow: "hidden",
            minHeight: `${displayImageWidth}rem`,
            zIndex: -1,
          }}
        >
          {f.frontImageUrl &&
            FlashcardImage(
              {
                ...f.frontImageProps,
              },
              f.frontImageId,
              f.frontImageUrl,
              displayImageWidth
            )}
          {(f.flashcardName || f.frontText) && (
            <Card.Body>
              <Card.Title>{f.flashcardName}</Card.Title>

              <Card.Text style={{ whiteSpace: "normal" }}>
                {" "}
                {f.frontText}
              </Card.Text>
            </Card.Body>
          )}
        </Card>
      </div>
      <Modal show={show} onExited={handleClose} onShow={() => setIsSaved(true)}>
        <Modal.Header>
          <Form.Control
            className="m-2"
            placeholder="Add a key phrase"
            defaultValue={f.flashcardName}
            style={{ border: 0, fontSize: 30 }}
            onChange={(e) => setFlashcardName(e.target.value)}
          />
          <Dropdown align={"end"}>
            <Dropdown.Toggle
              id="dropdown-basic"
              variant="light"
            ></Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                href="#/action-3"
                onClick={() =>
                  deleteFlashcard(currentUser.uid, subject, f.flashcardId)
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
            defaultValue={f.frontText}
            style={{ height: frontTextScrollHeight }}
            onChange={(e) => {
              setFrontTextScrollHeight(e.target.scrollHeight + 2);
              setFrontText(e.target.value);
            }}
            placeholder="Add a frontText"
          ></Form.Control>
          {error && <Alert variant="danger">{error}</Alert>}
          {ImageDropContainer(
            { ...frontImageProps },
            frontImageKey.imageId,
            frontImageKey.imageUrl,
            frontCrop,
            frontScale,
            frontRotation,
            showFrontCropper,
            setShowFrontCropper,
            setFrontCrop,
            setFrontRotation,
            setFrontScale,
            handleFrontImageChange,
            handleDeleteFrontImage
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
    </div>
  );
}
