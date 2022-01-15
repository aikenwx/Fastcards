import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./firebase";
import { Flashcard } from "./types";
import { editFlashcard } from "./databaseHandlers";
import { imageSizeLimit } from "./globalVariables";
import { checkFileIsImage, checkValidFileSize } from "./helperFunctions";

export const uploadFrontImageAndUpdateFlashcard = (
  uid: string,
  subjectId: string,
  file: File,
  originalFlashcard: Flashcard,
  updatedFlashcard: Flashcard,
) => {
  if (!checkFileIsImage(file)) {
    throw "File is not an image";
  } else if (!checkValidFileSize(file)) {
    throw "Image must be less than " + imageSizeLimit + " MB";
  } else {
    // delete current image from storage, if any
    if (originalFlashcard.frontImageId) {
      deleteObject(ref(storage, "images/" + originalFlashcard.frontImageId));
    }
    const storageRef = ref(storage, "images/" + updatedFlashcard.frontImageId);
    uploadBytes(storageRef, file).then(() =>
      getDownloadURL(storageRef).then((url) => {
        updatedFlashcard.frontImageUrl = url;
        editFlashcard(uid, subjectId, updatedFlashcard);
      })
    );
  }
};

export const uploadBackImageAndUpdateFlashcard = (
  uid: string,
  subjectId: string,
  file: File,
  originalFlashcard: Flashcard,
  updatedFlashcard: Flashcard,
) => {
  if (!checkFileIsImage(file)) {
    throw "File is not an image";
  } else if (!checkValidFileSize(file)) {
    throw "Image must be less than " + imageSizeLimit + " MB";
  } else {
    // delete current image from storage, if any
    if (originalFlashcard.backImageId) {
      deleteObject(ref(storage, "images/" + originalFlashcard.backImageId));
    }
    const storageRef = ref(storage, "images/" + updatedFlashcard.backImageId);
    uploadBytes(storageRef, file).then(() =>
      getDownloadURL(storageRef).then((url) => {
        updatedFlashcard.backImageUrl = url;
        editFlashcard(uid, subjectId, updatedFlashcard);
      })
    );
  }
};

export const deleteFrontImage = (originalFlashcard: Flashcard) => {
  deleteObject(ref(storage, "images/" + originalFlashcard.frontImageId));
};

export const deleteBackImage = (originalFlashcard: Flashcard) => {
  deleteObject(ref(storage, "images/" + originalFlashcard.backImageId));
};


export const deleteObjects = (path: string, objects: string[]) => {
  if (objects.length == 0) {
    return;
  }

  const currPath = path + objects.pop();

  deleteObject(ref(storage, currPath)).then(() => deleteObjects(path, objects));
};
