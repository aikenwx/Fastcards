import { imageSizeLimit } from "./globalVariables";

export const checkFileIsImage = (file: File) => {
  return file && file["type"].split("/")[0] === "image";
  
};

export const checkValidFileSize = (file: File) => {
  return file.size < imageSizeLimit * 1024 * 1024;
};

export const setAspectRatio = (
  src: string,
  setAspectRatio: (num: number) => void
) => {
  const image = new Image();
  image.src = src;
  image.onload = () => setAspectRatio(image.height / image.width);
};

export const getHeightAndWidthFromDataUrl = (dataURL:string) => new Promise(resolve => {
  const img = new Image()
  img.onload = () => {
    resolve({
      height: img.height,
      width: img.width
    })
  }
  img.src = dataURL
})