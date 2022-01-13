import { ImageConfig } from "./types";

export const imageSizeLimit = 5;
export const cropImageWidth = 30 ;
export const displayImageWidth = 15;

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

