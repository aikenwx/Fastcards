import React, { useState, useEffect } from "react";
import { Plus } from "react-bootstrap-icons";
import { Dropdown, Form, ButtonGroup, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NavBar from "./NavBar";
import { db } from "../firebase";
import { onValue, ref } from "firebase/database";
import { addSubject, deleteSubject, renameSubject } from "../databaseHandlers";
import { subject } from "../types";

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
    <>
      <NavBar />
      <Container>
        <div>
          {subjects.map((subject) => (
            <div key={subject.subjectId} className="mt-2">
              <Dropdown
                as={ButtonGroup}
                onToggle={() => {
                  if (open && subject.subjectId == currKey) {
                    setOpen(false);
                    setCurrKey("");
                  } else {
                    setOpen(true);
                    setCurrKey(subject.subjectId);
                  }
                }}
                show={open && currKey == subject.subjectId}
              >
                <Link
                  className="btn btn-primary"
                  to={"subject/" + subject.subjectId}
                >
                  {subject.name}
                </Link>

                <Dropdown.Toggle split id="dropdown-split-basic" />

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">
                    <Form
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Form.Label>Rename Subject</Form.Label>
                      <Form.Control
                        placeholder={subject.name}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onBlur={(e) =>
                          renameSubject(
                            currentUser.uid,
                            subject.subjectId,
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key == "Enter") {
                            setOpen(!open);
                            setCurrKey(subject.subjectId);
                          }
                        }}
                      />
                    </Form>
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="#/action-2"
                    onClick={() =>
                      deleteSubject(currentUser.uid, subject.subjectId)
                    }
                  >
                    Delete Subject
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ))}
        </div>
        <button className="btn btn-primary mt-2" onClick={handleSubmit}>
          {"Add Subject"}
          <Plus size={20}></Plus>
        </button>
      </Container>
    </>
  );
}
