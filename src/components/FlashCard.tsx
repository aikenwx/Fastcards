import React from "react";
import { flashcard } from "../types";




export default function FlashCard({f
, deleteHandler}:{f:flashcard, deleteHandler: (id: string)=>void}) {
return (
    <div className="container mt-3">
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
          <div className="card-title">{f.keyPhrase}</div>
          {f.isDescriptionVisible && <p className="card-text">{f.description}</p>}
          {f.isImageVisible && f.image && <img className="card-img-bottom" src={f.image} />}
        </div>
      </div>
      <button onClick={()=>deleteHandler(f.flashcardId)}>delete</button>
    </div>
  );
}
