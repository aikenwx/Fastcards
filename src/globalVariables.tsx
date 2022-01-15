import { ImageProps } from "./types";

export const imageSizeLimit = 5;
export const cropImageWidth = 30;
export const displayImageWidth = 15;

export const blankImageProps: ImageProps = {
  imageHeight: 0,
  imageWidth: 0,
  translateX: 0,
  translateY: 0,
  scale: 1,
  rotation: 0,
};
