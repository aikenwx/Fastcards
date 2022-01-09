import { imageSizeLimit } from "./globalVariables";

export const checkFileIsImage = (file: File) => {
  return file && file["type"].split("/")[0] === "image";
};

export const checkValidFileSize = (file: File) => {
  return file.size < imageSizeLimit * 1024 * 1024;
};