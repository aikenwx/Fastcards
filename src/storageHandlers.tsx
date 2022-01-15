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

export const uploadImageAndUpdateFlashcard = (
  uid: string,
  subjectId: string,
  file: File,
  originalFlashcard: Flashcard,
  updatedFlashcard: Flashcard
) => {
  if (!checkFileIsImage(file)) {
    throw "File is not an image";
  } else if (!checkValidFileSize(file)) {
    throw "Image must be less than " + imageSizeLimit + " MB";
  } else {
    // delete current image from storage, if any
    if (originalFlashcard.imageId) {
      deleteObject(ref(storage, "images/" + originalFlashcard.imageId));
    }
    const storageRef = ref(storage, "images/" + updatedFlashcard.imageId);
    uploadBytes(storageRef, file).then(() =>
      getDownloadURL(storageRef).then((url) => {
        updatedFlashcard.imageUrl = url;
        editFlashcard(uid, subjectId, updatedFlashcard);
      })
    );
  }
};

export const deleteImage = (originalFlashcard: Flashcard) => {
  deleteObject(ref(storage, "images/" + originalFlashcard.imageId));
};

export const deleteObjects = (path: string, objects: string[]) => {
  if (objects.length == 0) {
    return;
  }

  const currPath = path + objects.pop();

  deleteObject(ref(storage, currPath)).then(() => deleteObjects(path, objects));
};
