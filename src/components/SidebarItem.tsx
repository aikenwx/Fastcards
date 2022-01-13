import React, { useEffect, useState } from "react";
import { Dropdown, Nav } from "react-bootstrap";
import { Files } from "react-bootstrap-icons";
import DropDown from "./DropDown";
import { subject } from "../types";
import { deleteSubject, renameSubject } from "../databaseHandlers";
import { useAuth } from "../contexts/AuthContext";

export default function SidebarItem(
  subject: subject,
  toggle: boolean,
  setToggle: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { currentUser } = useAuth();

  const handleDelete = () => deleteSubject(currentUser.uid, subject);

  // const [open, setOpen] = useState(false);

  //useEffect(() => setOpen(false), [toggle]);

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
