export type OldFlashcard = {
  flashcardId: string;
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
};

export type Flashcard = {
  flashcardId: string;
  flashcardName: string;

  frontText: string;
  frontImageId: string;
  frontImageUrl: string;
  frontImageProps: ImageProps;

  backText: string;
  backImageId: string;
  backImageUrl: string;
  backImageProps: ImageProps;

  isFlipped: boolean;
  dateCreated: number;
  dateLastTested: number;
  testRecord: string;
};

export type Tag = {
  tagId: string;
  tagColor: string;
};

export type ImageProps = {
  imageHeight: number;
  imageWidth: number;
  translateY: number;
  translateX: number;
  rotation: number;
  scale: number;
};

export type Subject = {
  subjectId: string;
  subjectName: string;
  flashcards: Flashcard[];
  sortedBy: string;
  flashcardOrder: string[];
};

export type user = {
  userId: string;
  subjects: Subject[];
  subjectOrder: string[];
};

export type ImageConfig = {
  imageId: string;
  imageUrl: string;
  translateX: number;
  translateY: number;
  scale: number;
  rotation: number;
  imageWidth: number;
  imageHeight: number;
};

export type Crop = {
  x: number;
  y: number;
};

export type ImageDimensions = {
  imageWidth: number;
  imageHeight: number;
};

export type ImageKey = {
  imageId: string;
  imageUrl: string;
};
