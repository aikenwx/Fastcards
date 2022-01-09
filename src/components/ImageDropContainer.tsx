import React, { useRef, useState } from "react";
import { Dropdown, Form, Image } from "react-bootstrap";
import "../styles/imageDropBox.css";
import { Upload } from "react-bootstrap-icons";

export default function ImageDropContainer(
  src: string,
  handleImageChange: (e: any) => void,
  handleDeleteImage: () => void
) {
  const hiddenFileInput: any = useRef(null);
  const secondHiddenFileInput: any = useRef(null);
  const [showToggle, setShowToggle]: any = useState(false);
  
  const handleClick = (e: any) => {
    hiddenFileInput.current.click();
  };

  const secondHandleClick = (e: any) => {
      secondHiddenFileInput.current.click()
  }

  const imageElementConfig = {
      onMouseEnter:() => setShowToggle(true),
      onMouseLeave:() => setShowToggle(false)
  };

  if (src) {
    return (
      <div
        {...imageElementConfig}
      >
        {showToggle && (
          <Dropdown>
            <Dropdown.Toggle className="position-absolute" variant="light"></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={secondHandleClick}>Choose New Image</Dropdown.Item>
              <Dropdown.Item onClick={handleDeleteImage}>Delete Image</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
        <Image src={src} rounded />
        <input
          type="file"
          ref={secondHiddenFileInput}
          onChange={(e: any) => handleImageChange(e.target.files[0])}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>
    );
  }

  const dropContainerConfig = {
    className:
      "image-drop-box d-flex flex-column justify-content-center align-items-center",
    onDrop: (e: any) => {
      e.preventDefault();
      e.stopPropagation();
    },
    onDropCapture: (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      handleImageChange(e.dataTransfer.files[0]);
    },
    onDragOver: (e: any) => {
      e.stopPropagation();
      e.preventDefault();
    },
    onDragEnter: (e: any) => {
      e.stopPropagation();
      e.preventDefault();
    },
    onClick: handleClick,
  };

  return (
    <div {...dropContainerConfig}>
      <Upload size="30" color="#0d6efd"></Upload>
      Click to choose an image or drag it here
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={(e: any) => handleImageChange(e.target.files[0])}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
}
