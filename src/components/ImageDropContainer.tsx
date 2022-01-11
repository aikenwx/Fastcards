import React, { useRef, useState, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import "../styles/imageDropBox.css";
import { Upload } from "react-bootstrap-icons";
import Cropper from "react-easy-crop";
import FlashcardImage from "./FlashcardImage";
import { ImageConfig, Crop } from "./FlashCard";

export default function ImageDropContainer(
  imageConfig: ImageConfig,
  crop: Crop,
  scale: number,
  rotation: number,
  setCrop: (crop: Crop) => void,
  setRotation: (rotation: number) => void,
  setScale: (scale: number) => void,
  handleImageChange: (e: any) => void,
  handleDeleteImage: () => void
) {
  const hiddenFileInput: any = useRef(null);
  const secondHiddenFileInput: any = useRef(null);

  const [showToggle, setShowToggle]: any = useState(false);

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
      onRotationChange={setRotation}
    />
  );

  const handleClick = (e: any) => {
    hiddenFileInput.current.click();
  };

  if (imageConfig.imageUrl) {
    return (
      <div className="">
        {!showToggle && (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            onClick={() => setShowToggle(true)}
          >
            {FlashcardImage(imageConfig)}
          </div>
        )}
        {showToggle && (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="crop-container">
              {imageConfig.imageHeight > imageConfig.imageWidth
                ? greaterHeightCropper(imageConfig.imageUrl)
                : greaterLengthCropper(imageConfig.imageUrl)}
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
            <div>
              <Button className="m-2" onClick={handleDeleteImage}>Delete Image</Button>
              <Button className="m-2" onClick={() => setShowToggle(false)}>Done</Button>
            </div>
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
  };

  return (
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
  );
}
