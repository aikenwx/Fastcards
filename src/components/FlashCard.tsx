import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Dropdown, Form, Modal } from "react-bootstrap";
import { CaretDownFill, ThreeDots } from "react-bootstrap-icons";
import ReactCardFlip from "react-card-flip";
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
import "../styles/dashboard.scss";
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

  const [frontText, setFrontText] = useState(f.frontText);
  const [frontCrop, setFrontCrop]: [
    Crop,
    React.Dispatch<React.SetStateAction<Crop>>
  ] = useState({
    x: f.frontImageProps.translateX,
    y: f.frontImageProps.translateY,
  });
  const [frontImageKey, setFrontImageKey]: [
    ImageKey,
    React.Dispatch<React.SetStateAction<ImageKey>>
  ] = useState({
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
    setFrontImageKey({ imageUrl: f.frontImageUrl, imageId: f.frontImageId });
    setBackImageKey({ imageUrl: f.backImageUrl, imageId: f.backImageId });
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
      backText: backText,
      backImageId: backImageKey.imageId,
      backImageUrl: backImageKey.imageUrl,
      backImageProps: backImageProps,
    };

    console.log(f);
    console.log(updatedFlashcard);

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
      if (f.backImageId !== updatedFlashcard.backImageId) {
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
    } else if (f.backImageId !== updatedFlashcard.backImageId) {
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

  const handleFlip = () => {
    const flippedCard: Flashcard = { ...f };
    flippedCard.isFlipped = !flippedCard.isFlipped;
    editFlashcard(currentUser.uid, subject.subjectId, flippedCard);
  };

  const modalFace = (
    isFrontFace: boolean,
    originalText: string,
    textScrollHeight: number,
    showCropper: boolean,
    crop: Crop,
    rotation: number,
    scale: number,
    imageKey: ImageKey,
    imageProps: ImageProps,
    setTextScrollHeight: React.Dispatch<React.SetStateAction<number>>,
    setShowCropper: React.Dispatch<React.SetStateAction<boolean>>,
    setText: React.Dispatch<React.SetStateAction<string>>,
    setCrop: React.Dispatch<React.SetStateAction<Crop>>,
    setRotation: React.Dispatch<React.SetStateAction<number>>,
    setScale: React.Dispatch<React.SetStateAction<number>>,
    handleDeleteImage: () => void,
    handleImageChange: (file: any) => void
  ) => (
    <>
      <Modal.Body
        style={{ zIndex: `${isFrontFace != f.isFlipped ? 900 : -1}` }}
      >
        <Modal.Header>
          <div className="text-muted">{isFrontFace ? "Front" : "Back"}</div>
        </Modal.Header>
        <Form.Control
          ref={textAreaRef}
          as="textarea"
          className={"mb-2"}
          defaultValue={originalText}
          style={{ height: textScrollHeight }}
          onChange={(e) => {
            setTextScrollHeight(e.target.scrollHeight + 2);
            setText(e.target.value);
          }}
          placeholder="Enter text"
        ></Form.Control>
        {error && <Alert variant="danger">{error}</Alert>}
        {ImageDropContainer(
          { ...imageProps },
          imageKey.imageId,
          imageKey.imageUrl,
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
    </>
  );

  const cardFace = (
    isFrontFace: boolean,
    originalText: string,
    originalImageProps: ImageProps,
    originalImageId: string,
    originalImageUrl: string
  ) => (
    <div className="m-3">
      <Card style={{ border: "none" }}>
        <CaretDownFill
          className="edit-caret"
          onClick={handleShow}
        ></CaretDownFill>
      </Card>

      <div
        className="clickable-card"
        onClick={handleFlip}
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
          {originalImageUrl &&
            FlashcardImage(
              {
                ...originalImageProps,
              },
              originalImageId,
              originalImageUrl,
              displayImageWidth
            )}

          {(f.flashcardName || originalText) && (
            <Card.Body>
              {f.flashcardName && <Card.Title>{f.flashcardName}</Card.Title>}
              {originalText && (
                <Card.Text style={{ whiteSpace: "normal" }}>
                  {originalText}
                </Card.Text>
              )}
            </Card.Body>
          )}
        </Card>
      </div>
    </div>
  );

  return (
    <div>
      <ReactCardFlip isFlipped={f.isFlipped} >
          {cardFace(
            true,
            f.frontText,
            {
              ...f.frontImageProps,
            },
            f.frontImageId,
            f.frontImageUrl
          )}
          {cardFace(
            false,
            f.backText,
            {
              ...f.backImageProps,
            },
            f.backImageId,
            f.backImageUrl
          )}
      </ReactCardFlip>

      <Modal show={show} onExited={handleClose} onShow={() => setIsSaved(true)}>
        <Modal.Header>
          <Form.Control
            className="m-2"
            placeholder="Untitled"
            defaultValue={f.flashcardName}
            style={{ border: 0, fontSize: 30 }}
            onChange={(e) => setFlashcardName(e.target.value)}
          />
          <Dropdown align={"end"}>
            <Dropdown.Toggle
              as={ThreeDots}
              className="m-2 custom-toggle"
            ></Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleFlip}>
                {`Flip to ${f.isFlipped ? "back" : "front"}`}
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  deleteFlashcard(currentUser.uid, subject, f.flashcardId)
                }
              >
                Delete Flashcard
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Modal.Header>
        <ReactCardFlip isFlipped={f.isFlipped}>
          {modalFace(
            true,
            f.frontText,
            frontTextScrollHeight,
            showFrontCropper,
            frontCrop,
            frontRotation,
            frontScale,
            frontImageKey,
            frontImageProps,
            setFrontTextScrollHeight,
            setShowFrontCropper,
            setFrontText,
            setFrontCrop,
            setFrontRotation,
            setFrontScale,
            handleDeleteFrontImage,
            handleFrontImageChange
          )}
          {modalFace(
            false,
            f.backText,
            backTextScrollHeight,
            showBackCropper,
            backCrop,
            backRotation,
            backScale,
            backImageKey,
            backImageProps,
            setBackTextScrollHeight,
            setShowBackCropper,
            setBackText,
            setBackCrop,
            setBackRotation,
            setBackScale,
            handleDeleteBackImage,
            handleBackImageChange
          )}
        </ReactCardFlip>
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
