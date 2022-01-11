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
import { blankImageConfig, ImageConfig } from "./components/FlashCard";

const uuid = require("uuid");
const uuidv4 = uuid.v4;



export const uploadImageAndUpdateFlashcard = (
  uid: string,
  subjectId: string,
  file: File,
  originalFlashcard: flashcard,
  updatedFlashcard: flashcard,
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
    // move to front end
    // const imageId = uuidv4();
    const storageRef = ref(storage, "images/" + updatedFlashcard.imageId);
    uploadBytes(storageRef, file).then(() =>
      getDownloadURL(storageRef).then((url) => {
        updatedFlashcard.imageUrl = url;
        editFlashcard(uid, subjectId, updatedFlashcard);
      })
    );
  }
};

export const deleteImage = (
  originalFlashcard: flashcard
) => {
  deleteObject(ref(storage, "images/" + originalFlashcard.imageId));
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
