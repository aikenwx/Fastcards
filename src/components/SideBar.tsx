import React from "react";
import { Nav } from "react-bootstrap";
import { subject } from "../types";

export default function SideBar(subjects: subject[]) {
  return (
    <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="position-sticky pt-3">
        <Nav className="flex-column">
          {subjects.map((subject) => (
            <Nav.Item>
               
              <Nav.Link href={"subject/" + subject.subjectId}>
                {subject.name}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>
    </nav>
  );
}
