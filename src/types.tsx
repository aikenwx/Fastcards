export type Flashcard = {
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

export type NewFlashcard = {
  flashcardName: string
  flashcardId: string;
  keyPhrase: string;
  frontImage: Image;
  backImage: Image;
  frontText: string;
  backText: string;
  statData: StatData
  tags: Tag[];
  isFlipped: boolean;
  order: number
};


export type Tag = {
  tagId: string;
  tagColor: string;
}


export type StatData= {
  lastHundredTestScores: number[];
  dateCreation: Date;  
  dateLastTested: Date;
}




export type NewSubject = {
  subjectId: string;
  subjectName: string;
  flashcards: Flashcard[];
}



export type Image = {
  imageId: string;
  imageUrl: string;
  imageHeight: number;
  imageWidth: number;
  translateY: number;
  translateX: number;
  rotation: number;
  scale: number;
};


export type Subject = {
  subjectId: string;
  name: string;
  flashcards: Flashcard[];
};

export type user = {
  userId: string;
  subjects: Subject[];
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
