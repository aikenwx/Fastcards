import React, { useState, useEffect } from "react";
import { Dropdown, Form, ButtonGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import FlashCard from "./FlashCard";
import NavBar from "./NavBar";
import { db } from "../firebase";
import { onValue, push, ref } from "firebase/database";
import { addSubject, deleteSubject, renameSubject } from "../databaseHandlers";
import { subject } from "../types";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { logOut, currentUser } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects]: [subject[], any] = useState([]);
  const [formName, setFormName]: any = useState();
  const [open, setOpen]: any = useState();

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
      }
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
    addSubject(currentUser.uid, "test");
  }

  return (
    <>
      <NavBar />
      <div>
        {subjects.map((subject) => (
          <div key={subject.subjectId} className="mt-2">
            <Dropdown as={ButtonGroup} onOpen={()=>setOpen(true)} onClose={()=>setOpen(false)} isOpen={open}>
              <Link
                className="btn btn-primary"
                to={"subject/" + subject.subjectId}
              >
                {subject.name}
              </Link>

              <Dropdown.Toggle split id="dropdown-split-basic" />

              <Dropdown.Menu>
                <Dropdown.Item
                  href="#/action-1"
                  onClick={() =>
                    deleteSubject(currentUser.uid, subject.subjectId)
                  }
                >
                  Delete Subject
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2" onClick={(e:any)=>{e.preventDefault()
                setOpen(true)}}>
                  <Form >
                    <Form.Label>Rename Subject</Form.Label>
                    <Form.Control
                      placeholder={subject.name}
                      onBlur={(e) =>
                        renameSubject(
                          currentUser.uid,
                          subject.subjectId,
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                        }
                      }}
                    ></Form.Control>
                  </Form>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-2" onClick={handleSubmit}>
        Add Subject
      </button>
    </>
  );
}
