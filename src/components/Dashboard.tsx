import React, { useState, useEffect } from "react";
import { Plus } from "react-bootstrap-icons";
import {
  Dropdown,
  Nav,
  Form,
  ButtonGroup,
  Container,
  Row,
  Navbar,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "./NavBar";
import { db } from "../firebase";
import { onValue, ref } from "firebase/database";
import { addSubject, deleteSubject, renameSubject } from "../databaseHandlers";
import { subject } from "../types";
import DropDown from "./DropDown";
import SideBar from "./SideBar";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [subjects, setSubjects]: [subject[], any] = useState([]);
  const [open, setOpen]: any = useState();
  const [currKey, setCurrKey]: any = useState();

  //read
  useEffect(() => {
    onValue(ref(db, "Users/" + currentUser.uid), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        let arr: any[] = [];
        snapshot.forEach((data) => {
          data.forEach((x) => {
            let item = {
              subjectId: x.key,
              ...x.val(),
            };
            arr.push(item);
          });
        });
        setSubjects(arr);
      } else setSubjects([]);
    });
  }, []);

  const test = {
    flashcardId: "testID",
    keyPhrase: "testHello",
    image: "http://placekitten.com/200/200",
    description: "GOOD MORNING",
    isImageVisible: true,
    isDescriptionVisible: true,
  };

  async function handleSubmit() {
    addSubject(currentUser.uid, "New Subject");
  }

  return (
    <div>
      <NavBar></NavBar>
      <div className="container-fluid">
        <div className="row">
          <nav
            id="sidebarMenu"
            className="col-md-auto col-lg-auto d-md-block mw-10 bg-light sidebar collapse show vh-100"
          >
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
        </div>
      </div>
    </div>
  );
}
