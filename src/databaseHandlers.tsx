import { db } from "./firebase";
import { push, ref, remove , update } from "firebase/database";
import { subject } from "./types";


export const addSubject = (uid: string, subjectName: string) => {
  push(ref(db, "Users/" + uid + "/Subjects"), {
    name: subjectName,
  });
};

export const addFlashcard = (
  uid: string,
  subjectId: string,
  keyPhrase: string,
  image: string,
  description: string,
  isDescriptionVisible: boolean,
  isImageVisible: boolean
) => {
  push(ref(db, "Users/" + uid + "/Subjects/" + subjectId + "/Flashcards"), {
    keyPhrase: keyPhrase,
    image: image,
    description: description,
    isDescriptionVisible: isDescriptionVisible,
    isImageVisible: isImageVisible,
  });
};

export const deleteFlashcard = (
  uid: string,
  subjectId: string,
  flashcardId: string
) => {
  remove(
    ref(
      db,
      "Users/" + uid + "/Subjects/" + subjectId + "/Flashcards/" + flashcardId
    )
  );
};

export const deleteSubject = (
  uid: string,
  subjectId:string
) => {
  remove(
    ref(
      db, 
      "Users/" + uid + "/Subjects/" + subjectId
    )
  )
}

export const renameSubject = (
  uid: string,
  subjectId: string,
  newName: string
) => {


  update(
    ref(
      db, 
      "Users/" + uid + "/Subjects/" + subjectId
    ),  {name: newName}
  )
}
