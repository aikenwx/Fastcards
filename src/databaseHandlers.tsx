import { db } from "./firebase";
import { push, ref } from "firebase/database";
import { useParams } from "react-router-dom";
import { stringify } from "querystring";

export const addSubject = (uid: string, subjectName: string) => {
    
  push(ref(db, "Users/" + uid + "/Subjects"), {
    name: subjectName
  });

  

};

export const addFlashcard = (
  uid: string, 
  subjectId: string, 
  keyPhrase: string,
  image: string,
  description: string,
  isDescriptionVisible: boolean,
  isImageVisible: boolean  ) => {

  push(ref(db, "Users/" + uid + "/Subjects/" + subjectId + "/Flashcards"), {
    keyPhrase: keyPhrase,
    image: image,
    description: description,
    isDescriptionVisible: isDescriptionVisible,
    isImageVisible: isImageVisible
  })
}