import React, { useRef, useState, useCallback } from "react";
import {
  Button,
  Container,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "../styles/imageDropBox.scss";
import { Upload } from "react-bootstrap-icons";
import Cropper from "react-easy-crop";
import FlashcardImage from "./FlashcardImage";
import { ImageConfig, Crop } from "../types";
import { cropImageWidth } from "../globalVariables";

export default function ImageDropContainer(
  imageConfig: ImageConfig,
  crop: Crop,
  scale: number,
  rotation: number,
  showCropper: boolean,
  setShowCropper: (bool: boolean) => void,
  setCrop: (crop: Crop) => void,
  setRotation: (rotation: number) => void,
  setScale: (scale: number) => void,
  handleImageChange: (e: any) => void,
  handleDeleteImage: () => void
) {
  const hiddenFileInput: any = useRef(null);
  const secondHiddenFileInput: any = useRef(null);

  const greaterHeightCropper = (src: string) => (
    <Cropper
      image={src}
      crop={crop}
      zoom={scale}
      objectFit="horizontal-cover"
      rotation={rotation}
      aspect={1}
      onCropChange={setCrop}
      onZoomChange={setScale}
    />
  );

  const greaterLengthCropper = (src: string) => (
    <Cropper
      image={src}
      crop={crop}
      zoom={scale}
      objectFit="vertical-cover"
      rotation={rotation}
      aspect={1}
      onCropChange={setCrop}
      onZoomChange={setScale}
    />
  );

  const handleClick = (e: any) => {
    hiddenFileInput.current.click();
  };

  const handleChooseNewImageClick = (e: any) => {
    secondHiddenFileInput.current.click();
  };

  const renderDragHint = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Drag me!
    </Tooltip>
  );

  const renderClickHint = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to edit
    </Tooltip>
  );

  if (imageConfig.imageUrl) {
    return (
      <div className="">
        {!showCropper && (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            onClick={() => setShowCropper(true)}
          >
            <OverlayTrigger
              placement="right"
              delay={{ show: 400, hide: 400 }}
              overlay={renderClickHint}
            >
              {FlashcardImage(imageConfig, cropImageWidth)}
            </OverlayTrigger>
          </div>
        )}

        {showCropper && (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <OverlayTrigger
              placement="right"
              delay={{ show: 400, hide: 400 }}
              overlay={renderDragHint}
            >
              <div
                className="crop-container"
                style={{
                  height: `${cropImageWidth}rem`,
                  width: `${cropImageWidth}rem`,
                }}
              >
                {imageConfig.imageHeight > imageConfig.imageWidth
                  ? greaterHeightCropper(imageConfig.imageUrl)
                  : greaterLengthCropper(imageConfig.imageUrl)}
              </div>
            </OverlayTrigger>

            <Container>
              <div className="d-flex justify-content-center align-items-center">
                <Button
                  className="m-2"
                  variant="secondary"
                  onClick={() => setShowCropper(false)}
                >
                  Done
                </Button>
                <Button className="m-2" onClick={handleDeleteImage}>
                  Delete Image
                </Button>

                <Button className="m-2" onClick={handleChooseNewImageClick}>
                  Choose New Image
                </Button>
              </div>
              <Form.Label>Rotation</Form.Label>
              <Form.Range
                min={0}
                max={360}
                value={imageConfig.rotation}
                onChange={(e) => {
                  setRotation(parseInt(e.target.value));
                }}
              ></Form.Range>
              <Form.Label>Zoom</Form.Label>
              <Form.Range
                min={100}
                max={300}
                value={imageConfig.scale * 100}
                onChange={(e) => {
                  setScale(parseInt(e.target.value) / 100);
                }}
              ></Form.Range>
            </Container>
          </div>
        )}
        <input
          type="file"
          ref={secondHiddenFileInput}
          onChange={(e: any) => handleImageChange(e.target.files[0])}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>
    );
  }

  const dropContainerConfig = {
    className:
      "image-drop-box d-flex flex-column justify-content-center align-items-center",
    onDrop: (e: any) => {
      e.preventDefault();
      e.stopPropagation();
    },
    onDropCapture: (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      handleImageChange(e.dataTransfer.files[0]);
    },
    onDragOver: (e: any) => {
      e.stopPropagation();
      e.preventDefault();
    },
    onDragEnter: (e: any) => {
      e.stopPropagation();
      e.preventDefault();
    },
    onClick: handleClick,
    style: { height: `${cropImageWidth}rem`, width: `${cropImageWidth}rem` },
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div {...dropContainerConfig}>
        <Upload size="30" color="#0d6efd"></Upload>
        Click to choose an image or drag it here
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={(e: any) => handleImageChange(e.target.files[0])}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
