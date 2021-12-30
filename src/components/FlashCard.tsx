import React from "react";

export default function FlashCard({
  keyPhrase,
  image,
  description,
  isDescriptionVisible,
  isImageVisible,
}: {
  keyPhrase: string;
  image: string;
  description: string;
  isDescriptionVisible: boolean;
  isImageVisible: boolean;
}) {
  return (
    <div className="container mt-3">
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
          <div className="card-title">{keyPhrase}</div>
          {isDescriptionVisible && <p className="card-text">{description}</p>}
          {isImageVisible && image && <img className="card-img-bottom" src={image} />}
        </div>
      </div>
    </div>
  );
}
