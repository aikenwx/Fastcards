import { stringify } from "querystring";
import React from "react";
import { Image } from "react-bootstrap";
import Cropper from "react-easy-crop";
import { cropImageWidth } from "../globalVariables";
import "../styles/imageDropBox.css";
import { ImageConfig } from "../types";

export default function FlashcardImage(
  imageConfig: ImageConfig,
  imageWidth: number
  // ) {
  //   const crop = {
  //     x: (imageConfig.translateX * imageWidth) / cropImageWidth,
  //     y: (imageConfig.translateY * imageWidth) / cropImageWidth,
  //   };

  //   const greaterHeight = () => (
  //     <div
  //       className="crop-container"
  //       style={{ height: `${imageWidth}rem`, width: `${imageWidth}rem` }}
  //     >
  //       <Cropper
  //         image={imageConfig.imageUrl}
  //         crop={crop}
  //         zoom={imageConfig.scale}
  //         objectFit="horizontal-cover"
  //         rotation={imageConfig.rotation}
  //         aspect={1}
  //         onCropChange={() => {}}
  //         showGrid={false}
  //       />
  //     </div>
  //   );

  //   const greaterLength = () => (
  //     <div
  //       className="crop-container"
  // style={{ height: `${imageWidth}rem`, width: `${imageWidth}rem` }}
  //     >
  //       <Cropper
  //         image={imageConfig.imageUrl}
  //         crop={crop}
  //         zoom={imageConfig.scale}
  //         objectFit="vertical-cover"
  //         rotation={imageConfig.rotation}
  //         aspect={1}
  //         onCropChange={() => {}}
  //         showGrid={false}
  //       />
  //     </div>
  //   );

  //   if (imageConfig.imageHeight > imageConfig.imageWidth) {
  //     return greaterHeight();
  //   } else {
  //     return greaterLength();
  //   }
  // }

  // export function AlternativeFlashcardImage(
  //   imageConfig: ImageConfig,
  //   imageWidth: number
) {
  return imageConfig.imageHeight <= imageConfig.imageWidth ? (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        objectFit: "cover",
        width: `${imageWidth}rem`,
        height: `${imageWidth}rem`,
        overflow: "hidden",
        // borderRadius: "3px",
      }}
    >
      <img
        src={imageConfig.imageUrl}
        style={{
          height: "100%",
          transform: `translate(${imageConfig.translateX}px,${imageConfig.translateY}px)  rotate(${imageConfig.rotation}deg) scale(${imageConfig.scale})`,
        }}
      ></img>
    </div>
  ) : (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        objectFit: "cover",
        width: `${imageWidth}rem`,
        height: `${imageWidth}rem`,
        overflow: "hidden",
        // borderRadius: "3px",
      }}
    >
      <img
        src={imageConfig.imageUrl}
        style={{
          width: "100%",
          transform: `translate(${
            (imageConfig.translateX * imageWidth) / cropImageWidth
          }px,${
            (imageConfig.translateY * imageWidth) / cropImageWidth
          }px)  rotate(${imageConfig.rotation}deg) scale(${imageConfig.scale})`,
        }}
      ></img>
    </div>
  );
}
