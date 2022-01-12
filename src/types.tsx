export type flashcard = {
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
export type subject = {
  subjectId: string;
  name: string;
  flashcards: flashcard[];
};

export type user = {
  userId: string;
  subjects: subject[];
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
