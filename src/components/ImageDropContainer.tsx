import React, { useRef } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Form,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { Upload } from "react-bootstrap-icons";
import Cropper from "react-easy-crop";
import { cropImageWidth } from "../globalVariables";
import "../styles/imageDropBox.scss";
import { Crop, ImageProps } from "../types";
import FlashcardImage from "./FlashcardImage";

export default function ImageDropContainer(
  imageProps: ImageProps,
  imageId: string,
  imageUrl: string,
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
  const imageConfig = {
    ...imageProps,
    imageId: imageId,
    imageUrl: imageUrl,
  };

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
      onRotationChange={setRotation}
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
      onRotationChange={setRotation}
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
              {FlashcardImage(imageProps, imageId, imageUrl, cropImageWidth)}
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
                <ButtonGroup className="m-2">
                  <Button
                    variant="secondary"
                    onClick={() => setShowCropper(false)}
                  >
                    Done
                  </Button>
                  <Button onClick={handleDeleteImage} variant="dark">
                    Delete Image
                  </Button>

                  <Button onClick={handleChooseNewImageClick} variant="dark">
                    Choose New Image
                  </Button>
                </ButtonGroup>
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
                style={{color:"black"}}
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
