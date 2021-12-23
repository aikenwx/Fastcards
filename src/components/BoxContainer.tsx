import React from "react";
import { Container } from "react-bootstrap";

export default function BoxContainer({ element }: { element: any }) {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {element}
      </div>
    </Container>
  );
}
