import React from "react";
import { Image } from "react-bootstrap";
import Cropper from "react-easy-crop";
import "../styles/imageDropBox.css";
import { ImageConfig } from "./FlashCard";

export default function FlashcardImage(imageConfig: ImageConfig) {
  const crop = { x: imageConfig.translateX, y: imageConfig.translateY };
  const greaterHeight = () => (
    <div className="crop-container">
      <Cropper
        image={imageConfig.imageUrl}
        crop={crop}
        zoom={imageConfig.scale}
        objectFit="horizontal-cover"
        rotation={imageConfig.rotation}
        aspect={1}
        onCropChange={() => {}}
        showGrid={false}
      />
    </div>
  );

  const greaterLength = () => (
    <div className="crop-container">
      <Cropper
        image={imageConfig.imageUrl}
        crop={crop}
        zoom={imageConfig.scale}
        objectFit="vertical-cover"
        rotation={imageConfig.rotation}
        aspect={1}
        onCropChange={() => {}}
        showGrid={false}
      />
    </div>
  );

  if (imageConfig.imageHeight > imageConfig.imageWidth) {
    return greaterHeight();
  } else {
    return greaterLength();
  }
}
