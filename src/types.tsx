export type flashcard = {
  flashcardId: string;
  keyPhrase: string;
  image: string;
  description: string;
  isDescriptionVisible: boolean;
  isImageVisible: boolean;
};
export type subject = {
  subjectId: string;
  name: string;
  flashcards: flashcard[];
};

export type user = {
  userId: string;
  subjects: subject[];
};
