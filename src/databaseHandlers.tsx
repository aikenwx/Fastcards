import { push, ref, remove, update } from "firebase/database";
import { db } from "./firebase";
import { stringifyImageProps, stringifyOrder } from "./helperFunctions";
import { deleteObjects } from "./storageHandlers";
import { Flashcard, Subject } from "./types";

export type UploadedFlashcard = {
  flashcardName: string;

  frontText: string;
  frontImageId: string;
  frontImageUrl: string;
  frontImagePropsString: string;

  backText: string;
  backImageId: string;
  backImageUrl: string;
  backImagePropsString: string;

  isFlipped: boolean;
  dateCreated: number;
  dateLastTested: number;

  testRecord: string;
};

export type uploadedSubject = {
  subjectName: string;
  sortedBy: string;
  flashcardOrderString: string;
};

export const blankUploadedSubject: uploadedSubject = {
  subjectName: "",
  sortedBy: "",
  flashcardOrderString: stringifyOrder([]),
};

export const blankUploadedFlashcard: UploadedFlashcard = {
  flashcardName: "",

  frontText: "",
  frontImageId: "",
  frontImageUrl: "",
  frontImagePropsString: "",

  backText: "",
  backImageId: "",
  backImageUrl: "",
  backImagePropsString: "",

  isFlipped: false,
  dateCreated: Date.now(),
  dateLastTested: Date.now(),
  testRecord: "",
};

export const addSubject = (
  uid: string,
  subjectName: string,
  subjectOrder: string[]
) => {
  const uploadedSubject: uploadedSubject = { ...blankUploadedSubject };
  uploadedSubject.subjectName = subjectName;

  const subjectId = push(
    ref(db, "Users/" + uid + "/Subjects"),
    uploadedSubject
  ).key;

  if (subjectId) {
    subjectOrder.push(subjectId);
  }

  update(ref(db, "Users/" + uid), {
    subjectOrderString: stringifyOrder(subjectOrder),
  });
};

export const deleteSubject = (
  uid: string,
  subject: Subject,
  subjectOrder: string[]
) => {
  subjectOrder.filter((x) => x != subject.subjectId);

  const imageIds: string[] = [];

  subject.flashcards.map((f) => {
    imageIds.push(f.frontImageId);
    imageIds.push(f.backImageId);
  });

  update(ref(db, "Users/" + uid), {
    subjectOrderString: stringifyOrder(subjectOrder),
  });

  remove(ref(db, "Users/" + uid + "/Subjects/" + subject.subjectId)).then(() =>
    deleteObjects("images/", imageIds)
  );
};

export const renameSubject = (
  uid: string,
  subjectId: string,
  newName: string
) => {
  update(ref(db, "Users/" + uid + "/Subjects/" + subjectId), { subjectName: newName });
};

export const createNewFlashcard = (
  uid: string,
  subject: Subject,
  flashcardName: string
) => {
  let updatedOrder: string[] = [...subject.flashcardOrder];

  const newFlashcard: UploadedFlashcard = { ...blankUploadedFlashcard };
  newFlashcard.flashcardName = flashcardName;

  const flashcardId = push(
    ref(db, "Users/" + uid + "/Subjects/" + subject.subjectId + "/Flashcards"),
    newFlashcard
  ).key;

  if (flashcardId) {
    updatedOrder.push(flashcardId);
  }

  update(ref(db, "Users/" + uid + "/Subjects" + subject.subjectId), {
    flashcardOrderString: stringifyOrder(updatedOrder),
  });
};

export const deleteFlashcard = (
  uid: string,
  subject: Subject,
  flashcardId: string
) => {
  let updatedOrder: string[] = [...subject.flashcardOrder];
  updatedOrder = updatedOrder.filter((x) => x != flashcardId);

  remove(
    ref(
      db,
      "Users/" +
        uid +
        "/Subjects/" +
        subject.subjectId +
        "/Flashcards/" +
        flashcardId
    )
  ).then(() =>
    update(ref(db, "Users/" + uid + "/Subjects" + subject.subjectId), {
      flashcardOrderString: stringifyOrder(updatedOrder),
    })
  );
};

export const editFlashcard = (
  uid: string,
  subjectId: string,
  flashcard: Flashcard
) => {
  const frontImagePropsString = stringifyImageProps(flashcard.frontImageProps);
  const backImagePropsString = stringifyImageProps(flashcard.backImageProps);

  const uploadedCard: UploadedFlashcard = {
    ...flashcard,
    frontImagePropsString: frontImagePropsString,
    backImagePropsString: backImagePropsString,
  };

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
