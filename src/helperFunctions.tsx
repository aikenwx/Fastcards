import { blankImageProps, imageSizeLimit } from "./globalVariables";
import { ImageProps } from "./types";

export const checkFileIsImage = (file: File) => {
  return file && file["type"].split("/")[0] === "image";
};

export const checkValidFileSize = (file: File) => {
  return file.size < imageSizeLimit * 1024 * 1024;
};

export const getHeightAndWidthFromDataUrl = (dataURL: string) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width,
      });
    };
    img.src = dataURL;
  });

export const getImageProps = (imagePropsString: string) => {
  const obj = JSON.parse(imagePropsString);
  const res: ImageProps = obj;
  return res;
};

export const stringifyImageProps = (imageProps: ImageProps) => {
  return JSON.stringify(imageProps);
};

export const parseOrder: (orderString: string) => string[] = (
  orderString: string
) => {
  return JSON.parse(orderString);
};

export const stringifyOrder = (orderArray: string[]) => {
  return JSON.stringify(orderArray);
};
