import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  ButtonGroup,
  Container,
  Dropdown,
  Form,
  Nav,
  Spinner
} from "react-bootstrap";
import { Files, House, Plus, ThreeDots } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { addSubject, deleteSubject, renameSubject } from "../databaseHandlers";
import { db } from "../firebase";
import { cropImageWidth } from "../globalVariables";
import "../styles/dashboard.scss";
import { Flashcard, Subject } from "../types";
import DisplayedSubject from "./DisplayedSubject";
import NavBar from "./NavBar";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects]: [Subject[], any] = useState([]);
  const [open, setOpen]: any = useState();
  const [currKey, setCurrKey]: any = useState();
  const [ setToggleFocus]: any = useState(-1);
  const [hover, setHover]: any = useState(false);
  // const formRefs: any = useRef([]);
  const [subjectNames, setSubjectNames]: [string[], any] = useState([]);
  const params = useParams();
  const [subjectId, setSubjectId]: any = useState();

  //read

  useEffect(() => {
    setSubjectId(params.subjectId);
  }, []);

  useEffect(() => {
    onValue(ref(db, "Users/" + currentUser.uid), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        let arr: any[] = [];
        snapshot.forEach((data) => {
          data.forEach((x) => {
            const flashcards: Flashcard[] = [];

            for (const flashcardId in x.val().Flashcards) {
              const flashcard: Flashcard = {
                flashcardId: flashcardId,
                ...x.val().Flashcards[flashcardId],
              };

              flashcards.push(flashcard);
            }
            let item = {
              subjectId: x.key,
              flashcards: flashcards,
              name: x.val().name,
            };
            arr.push(item);
          });
        });

        setSubjects(arr);
        setSubjectNames(arr.map((x) => x.name));
      } else setSubjects([]);
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="vh-100 d-flex flex-column">
        <NavBar></NavBar>
        <Container
          fluid
          className="d-flex flex-grow-1 align-items-center justify-content-center"
        >
          <Spinner
            animation="border"
            style={{
              height: `${cropImageWidth / 3}rem`,
              width: `${cropImageWidth / 3}rem`,
            }}
          ></Spinner>
        </Container>
      </div>
    );
  }

  function handleSubmit() {
    addSubject(currentUser.uid, "New Deck");
  }

  const handleNameChange = (e: any, num: number) => {
    const namesCopy = [...subjectNames];
    namesCopy[num] = e.target.value;
    setSubjectNames(namesCopy);
  };

  const handleBlur = (subjectId: string, subjectName: string) =>
    renameSubject(currentUser.uid, subjectId, subjectName);

  const displayedSubjects = (subjectId: string | undefined) => {
    const subject: any = subjects.find((x) => x.subjectId == subjectId);
    if (subject) {
      return (
        <div key={subjectId}>
     
          <Form.Control
            className="m-2"
            placeholder="Add a key phrase"
            defaultValue={subject.name}
            style={{ border: 0, fontSize: 30 }}
            onChange={(e) => handleNameChange(e, 0)}
            onBlur={() => handleBlur(subject.subjectId, subjectNames[0])}
          />
          {DisplayedSubject(subject, currentUser)}
        </div>
      );
    }

    return subjects.map((subject: Subject, num: number) => (
      <div key={subject.subjectId}>
        <Form.Control
          className="m-2"
          placeholder="Add a key phrase"
          defaultValue={subject.name}
          style={{ border: 0, fontSize: 30 }}
          onChange={(e) => handleNameChange(e, num)}
          onBlur={() => handleBlur(subject.subjectId, subjectNames[num])}
        />
        {DisplayedSubject(subject, currentUser)}
      </div>
    ));
  };

  return (
    <div className="vh-100 d-flex flex-column">
      <NavBar></NavBar>
      <Container fluid className="d-flex flex-grow-1">
        <div className="row">
          <nav
            id="sidebarMenu"
            className="col-md-auto col-lg-auto d-md-block mw-10 bg-light sidebar collapse show"
          >
            <div className="position-sticky pt-3">
              <div className="text-muted">SEARCH</div>

              <Nav className="flex-column">
                <Form.Control></Form.Control>
                <Nav.Link
                  className="sidebar-item d-flex align-items-center"
                  as={Dropdown.Item}
                  style={{ color: "black", width: "18rem" }}
                  href="/"
                >
                  <House className="m-1"></House>
                  Dashboard
                </Nav.Link>
              </Nav>
              <div className="text-muted">SAVED DECKS</div>

              <Nav className="flex-column">
                {subjects.map((subject, num) => (
                  <div
                    className="d-flex align-items-center"
                    key={subject.subjectId}
                    onMouseEnter={() => setToggleFocus(num)}
                    onMouseLeave={() => setToggleFocus(-1)}
                  >
                    <Nav.Link
                      className="sidebar-item d-flex align-items-center"
                      as={Dropdown.Item}
                      variant="light"
                      href={subject.subjectId}
                      style={{
                        color: "black",
                      }}
                    >
                      <Files className="m-1"></Files>
                      <div
                        style={{
                          maxWidth: "13rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {subject.name}
                      </div>
                    </Nav.Link>
                    <div style={{ position: "absolute", right: 0 }}>
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
                        {" "}
                        <Dropdown.Toggle
                          onMouseEnter={() => setHover(true)}
                          onMouseLeave={() => setHover(false)}
                          as={ThreeDots}
                          className="m-2 custom-toggle"
                          style={{
                            color: !hover ? "gray" : "black",
                          }}
                        ></Dropdown.Toggle>
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
                                defaultValue={subject.name}
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
                                    e.stopPropagation();
                                    e.preventDefault();
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
                              deleteSubject(currentUser.uid, subject)
                            }
                          >
                            Delete Subject
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                ))}
                <Nav.Link
                  onClick={handleSubmit}
                  className="d-flex align-items-center sidebar-button"
                  as={Dropdown.Item}
                  style={{ color: "black" }}
                >
                  <Plus className="m-1"></Plus>
                  Add Deck
                </Nav.Link>
              </Nav>
            </div>
          </nav>
        </div>
        <Container fluid>{displayedSubjects(subjectId)}</Container>
      </Container>
    </div>
  );
}
