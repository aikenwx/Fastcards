import { imageSizeLimit } from "./globalVariables";
import { ImageProps, Subject } from "./types";

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

export const search = (subjects: Subject[], searchString: string) => {
  const result = subjects.map((subject) => {
    const resSubject = { ...subject };
    if (
      resSubject.subjectName.toLowerCase() == searchString.toLocaleLowerCase()
    ) {
      return resSubject;
    }
    const flashcards = subject.flashcards.filter((flashcard) => {
      const str = searchString.toLowerCase();
      return (
        flashcard.frontText.toLowerCase().includes(str) ||
        flashcard.backText.toLowerCase().includes(str) ||
        flashcard.flashcardName.toLowerCase().includes(str)
      );
    });
    resSubject.flashcards = flashcards;
    return resSubject;
  });
  return result;
};
