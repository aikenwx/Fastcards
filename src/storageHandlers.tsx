import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { stringify } from "querystring";
import { storage } from "./firebase";
import { flashcard } from "./types";
import { editFlashcard } from "./databaseHandlers";
import { imageSizeLimit } from "./globalVariables";
import { checkFileIsImage, checkValidFileSize } from "./helperFunctions";

const uuid = require("uuid");
const uuidv4 = uuid.v4;



export const uploadImage = (
  uid: string,
  subjectId: string,
  file: File,
  flashcard: flashcard
) => {
  if (!checkFileIsImage(file)) {
    throw "File is not an image";
  } else if (!checkValidFileSize(file)) {
    throw "Image must be less than " + imageSizeLimit + " MB";
  } else {
    // delete current image from storage, if any
    if (flashcard.imageId) {
      deleteObject(ref(storage, "images/" + flashcard.imageId));
    }
    const imageId = uuidv4();
    const storageRef = ref(storage, "images/" + imageId);

    uploadBytes(storageRef, file).then(() =>
      getDownloadURL(storageRef).then((url) => {
        const updatedFlashcard: flashcard = { ...flashcard };
        updatedFlashcard.imageId = imageId;
        updatedFlashcard.imageUrl = url;
        editFlashcard(uid, subjectId, updatedFlashcard);
      })
    );
  }
};

export const deleteImage = (
  uid: string,
  subjectId: string,
  flashcard: flashcard
) => {
  deleteObject(ref(storage, "images/" + flashcard.imageId));
  const updatedFlashcard: flashcard = { ...flashcard };
  updatedFlashcard.imageId = "";
  updatedFlashcard.imageUrl = "";
  editFlashcard(uid, subjectId, updatedFlashcard);
};

export const deleteObjects = (path: string, objects: string[]) => {
  if (objects.length == 0) {
    return
  }

  const currPath = path + objects.pop()

  deleteObject(ref(storage, currPath)).then(
    () => deleteObjects(path, objects)    
  )
};
