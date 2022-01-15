import { cropImageWidth } from "../globalVariables";
import { ImageProps } from "../types";

export default function FlashcardImage(
  imageProps: ImageProps,
  imageId: string,
  imageUrl: string,
  imageWidth: number
) {
  const imageConfig = {
    ...imageProps,
    imageId: imageId,
    imageUrl: imageUrl,
  };

  return imageConfig.imageHeight <= imageConfig.imageWidth ? (
    <div
      className="d-flex flex-column justify-content-center align-items-center flashcard-image"
      style={{
        objectFit: "cover",
        width: `${imageWidth}rem`,
        height: `${imageWidth}rem`,
        overflow: "hidden",
      }}
    >
      <img
        src={imageConfig.imageUrl}
        style={{
          height: "100%",
          transform: `translate(${
            (imageConfig.translateX * imageWidth) / cropImageWidth
          }px,${
            (imageConfig.translateY * imageWidth) / cropImageWidth
          }px)  rotate(${imageConfig.rotation}deg) scale(${imageConfig.scale})`,
        }}
      ></img>
    </div>
  ) : (
    <div
      className="d-flex flex-column justify-content-center align-items-center flashcard-image"
      style={{
        objectFit: "cover",
        width: `${imageWidth}rem`,
        height: `${imageWidth}rem`,
        overflow: "hidden",
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
