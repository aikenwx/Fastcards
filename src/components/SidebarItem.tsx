import React from "react";
import { Dropdown, Nav } from "react-bootstrap";
import { Files } from "react-bootstrap-icons";
import { useAuth } from "../contexts/AuthContext";
import { deleteSubject } from "../databaseHandlers";
import { Subject } from "../types";
import DropDown from "./DropDown";

export default function SidebarItem(
  subject: Subject,
  toggle: boolean,
  setToggle: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { currentUser } = useAuth();

  const handleDelete = () => deleteSubject(currentUser.uid, subject);

  return (
    <div className="d-flex align-items-center">
      <Nav.Link
        className="sidebar-item d-flex align-items-center"
        as={Dropdown.Item}
        variant="light"
        href={"subject/" + subject.subjectId}
        style={{ color: "black" }}
      >
        <Files className="m-1"></Files>

        {subject.name}
      </Nav.Link>
      <div style={{ position: "absolute", right: 0 }}>
        <DropDown placement="bottom-start">
          <Dropdown.Menu>
            <Dropdown.Item>Rename</Dropdown.Item>
            <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </DropDown>
      </div>
    </div>
  );
}
