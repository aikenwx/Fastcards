import { db } from "./firebase";
import { push, ref, remove, update } from "firebase/database";
import { flashcard } from "./types";
import { deleteObjects } from "./storageHandlers";
import { blankImageConfig } from "./globalVariables";

export const addSubject = (uid: string, subjectName: string) => {
  push(ref(db, "Users/" + uid + "/Subjects"), {
    name: subjectName,
  });
};

export type UploadedFlashcard = {
  keyPhrase: string;
  imageId: string;
  imageUrl: string;
  description: string;
  imageHeight: number;
  imageWidth: number;
  translateY: number;
  translateX: number;
  rotation: number;
  scale: number;
  isDescriptionVisible: boolean;
  isImageVisible: boolean;
  isFlipped: boolean;
};

export const blankUploadedFlashcard: UploadedFlashcard = {
  keyPhrase: "",
  description: "",
  isDescriptionVisible: false,
  isImageVisible: false,
  isFlipped: false,
  ...blankImageConfig,
};

// export const addFlashcard = (
//   uid: string,
//   subjectId: string,
//   keyPhrase: string,
//   imageId: string,
//   imageUrl: string,
//   description: string,
//   isDescriptionVisible: boolean,
//   isImageVisible: boolean
// ) => {
//   push(ref(db, "Users/" + uid + "/Subjects/" + subjectId + "/Flashcards"), {
//     keyPhrase: keyPhrase,
//     imageId: imageId,
//     imageUrl: imageUrl,
//     description: description,
//     isDescriptionVisible: isDescriptionVisible,
//     isImageVisible: isImageVisible,
//   });
// };

export const createNewFlashcard = (
  uid: string,
  subjectId: string,
  keyPhrase: string
) => {
  const newFlashcard: UploadedFlashcard = { ...blankUploadedFlashcard };
  newFlashcard.keyPhrase = keyPhrase;

  push(
    ref(db, "Users/" + uid + "/Subjects/" + subjectId + "/Flashcards"),
    newFlashcard
  );
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

export const deleteSubject = (uid: string, subject: any) => {
  const imageIds: string[] = [];

  for (const flashcard in subject.Flashcards) {
    imageIds.push(subject.Flashcards[flashcard].imageId);
  }

  remove(ref(db, "Users/" + uid + "/Subjects/" + subject.subjectId)).then(() =>
    deleteObjects("images/", imageIds)
  );
};

export const renameSubject = (
  uid: string,
  subjectId: string,
  newName: string
) => {
  update(ref(db, "Users/" + uid + "/Subjects/" + subjectId), { name: newName });
};

export const editFlashcard = (
  uid: string,
  subjectId: string,
  flashcard: flashcard
) => {
  const uploadedCard: {
    keyPhrase: string;
    imageId: string;
    imageUrl: string;
    imageHeight: number;
    imageWidth: number;
    translateY: number;
    translateX: number;
    rotation: number;
    scale: number;
    description: string;
    isDescriptionVisible: boolean;
    isImageVisible: boolean;
    isFlipped: boolean;
  } = { ...flashcard };

  update(
    ref(
      db,
      "Users/" +
        uid +
        "/Subjects/" +
        subjectId +
        "/Flashcards/" +
        flashcard.flashcardId
    ),
    uploadedCard
  );
};
// export const updateFlashcard = (
//   uid: string,
//   subjectId:string,
//   flashcardId: string,
//   keyPhrase?: string,
//   image?: string,
//   description?: string,
//   isDescriptionVisible?: string,
//   isImageVisible?: string
// ) => {

//   const updatedParameters = {
//     flashcardId: flashcardId
//   }

//   if (keyPhrase) {
//     flashcardId + {keyPhrase: keyPhrase}
//   }

//   update(
//     ref(
//       db,
//       "Users/"+ uid + "/Subjects/" + subjectId + "/Flashcards/" + flashcardId
//       ), {
//         keyPhrase: keyPhrase,
//         image: image,
//         description: description,
//         isDescriptionVisible: isDescriptionVisible,
//         isImageVisible: isImageVisible
//       }
//   )
// }
