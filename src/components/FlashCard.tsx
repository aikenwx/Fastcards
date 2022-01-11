import React, { useState, useEffect } from "react";
import { editFlashcard, deleteFlashcard } from "../databaseHandlers";
import { flashcard } from "../types";
import { useAuth } from "../contexts/AuthContext";
import "../styles/dropdown.css";
import { Dropdown, Form, Modal, Button, Card } from "react-bootstrap";
import { deleteImage, uploadImageAndUpdateFlashcard } from "../storageHandlers";
import {
  checkFileIsImage,
  checkValidFileSize,
  getHeightAndWidthFromDataUrl,
} from "../helperFunctions";
import { imageSizeLimit } from "../globalVariables";
import ImageDropContainer from "./ImageDropContainer";
import FlashcardImage from "./FlashcardImage";
import { AspectRatio } from "react-bootstrap-icons";

export type ImageConfig = {
  imageId: string;
  imageUrl: string;
  translateX: number;
  translateY: number;
  scale: number;
  rotation: number;
  imageWidth: number;
  imageHeight: number;
};

export const blankImageConfig: ImageConfig = {
  imageId: "",
  imageUrl: "",
  translateX: 0,
  translateY: 0,
  scale: 1,
  rotation: 0,
  imageWidth: 0,
  imageHeight: 0,
};

export type Crop = {
  x: number;
  y: number;
};

export type ImageDimensions = {
  imageWidth: number;
  imageHeight: number;
};

export type ImageKey = {
  imageId: string;
  imageUrl: string;
};

export default function FlashCard({
  f,
  subjectId,
}: {
  f: flashcard;
  subjectId: string;
}) {
  const { currentUser } = useAuth();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

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

  const imageConfig: ImageConfig = {
    ...imageKey,
    ...imageDimensions,
    scale: scale,
    rotation: rotation,
    translateX: crop.x,
    translateY: crop.y,
  };

  const setImageConfig = (imageConfig: ImageConfig) => {
    if (
      imageConfig.imageId !== f.imageId ||
      imageConfig.imageUrl !== f.imageUrl
    ) {
      setImageKey({ ...imageConfig });
    }

    if (
      imageConfig.imageHeight !== f.imageHeight ||
      imageConfig.imageWidth !== f.imageHeight
    ) {
      setImageDimensions({ ...imageConfig });
    }

    if (imageConfig.rotation !== f.rotation) {
      setRotation(imageConfig.rotation);
    }

    if (imageConfig.scale !== f.scale) {
      setScale(imageConfig.scale);
    }

    if (
      imageConfig.translateX !== f.translateX ||
      imageConfig.translateX !== f.translateX
    ) {
      setCrop({ x: imageConfig.translateX, y: imageConfig.translateY });
    }
  };

  const [imageFile, setImageFile]: any = useState();

  const uuid = require("uuid");
  const uuidv4 = uuid.v4;

  const handleClose = () => {
    setShow(false);
  };

  // reset data once modal flashcard is closed
  useEffect(() => {
    setImageFile();
    setImageConfig({ ...f });
  }, [show]);

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

  const handleDeleteImage = () => {
    setImageConfig({ ...blankImageConfig });
    setImageFile();
  };

  return (
    <div className="container mt-3">
      <Card className="card" style={{ width: "18rem" }} onClick={handleShow}>
        <div className="card-body" style={{objectFit:"contain"}}>
          <div className="card-title">{f.keyPhrase}</div>
          {f.isDescriptionVisible && (
            <p className="card-text">{f.description}</p>
          )}
          {f.isImageVisible && f.imageUrl && FlashcardImage(imageConfig)}
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
            imageConfig,
            crop,
            scale,
            rotation,
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
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
