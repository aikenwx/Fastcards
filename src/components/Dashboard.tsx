import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  ButtonGroup,
  Container,
  Dropdown,
  Form,
  Nav,
  Navbar,
  Spinner
} from "react-bootstrap";
import { Files, House, Plus, ThreeDots } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  addSubject,
  deleteSubject,
  renameSubject,
  UploadedFlashcard,
  uploadedSubject
} from "../databaseHandlers";
import { db } from "../firebase";
import { cropImageWidth } from "../globalVariables";
import { getImageProps, parseOrder, search } from "../helperFunctions";
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

  const [subjectOrder, setSubjectOrder]: [string[], any] = useState([]);
  const [subjectNames, setSubjectNames]: [string[], any] = useState([]);
  const params = useParams();
  const [subjectId, setSubjectId]: any = useState();

  const [fetchedSubjects, setFetchedSubjects]: [Subject[], any] = useState([]);

  useEffect(() => {
    setSubjectId(params.subjectId);
  }, []);

  useEffect(() => {
    onValue(ref(db, "Users/" + currentUser.uid), (snapshot) => {
      const data = snapshot.val();

      if (data !== null) {
        const subjectIds = parseOrder(data.subjectOrderString);
        setSubjectOrder(subjectIds);

        const subjects = subjectIds.map((subjectId) => {
          const fetchedSubject: uploadedSubject = data.Subjects[subjectId];

          const flashcardIds = parseOrder(
            data.Subjects[subjectId].flashcardOrderString
          );

          const flashcards = flashcardIds.map((flashcardId) => {
            const fetchedFlashcard: UploadedFlashcard =
              data.Subjects[subjectId].Flashcards[flashcardId];

            const flashcard: Flashcard = {
              flashcardId: flashcardId,
              ...fetchedFlashcard,
              frontImageProps: getImageProps(
                fetchedFlashcard.frontImagePropsString
              ),
              backImageProps: getImageProps(
                fetchedFlashcard.backImagePropsString
              ),
            };

            return flashcard;
          });

          const subject: Subject = {
            subjectId: subjectId,
            flashcardOrder: flashcardIds,
            flashcards: flashcards,
            ...fetchedSubject,
          };
          return subject;
        });
        setFetchedSubjects([...subjects]);
        setSubjects(subjects);
        setSubjectNames(subjects.map((x) => x.subjectName));
      } else {
        setFetchedSubjects([]);
        setSubjects([]);
      }
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
    addSubject(currentUser.uid, "New Deck", subjectOrder);
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
            placeholder="Untitled"
            defaultValue={subject.subjectName}
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
          defaultValue={subject.subjectName}
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
          <Navbar collapseOnSelect expand={"lg"} className="d-block" variant="light">
            <div
              className="sidebar-menu"
              style={{ position: "-webkit-sticky", top: "3rem" }}
            >
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse className=" pt-3" id="responsive-navbar-nav">
                <div>
                  <div className="text-muted">SEARCH</div>

                  <Nav className="flex-column">
                    <Form.Control
                      onChange={(e) =>
                        setSubjects(search(fetchedSubjects, e.target.value))
                      }
                    ></Form.Control>
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
                            {subject.subjectName}
                          </div>
                        </Nav.Link>
                        <div style={{ position: "absolute", right: 0 }}>
                          <Dropdown
                            align="end"
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
                              as={ThreeDots}
                              className="m-2 custom-toggle"
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
                                    defaultValue={subject.subjectName}
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
                                  deleteSubject(
                                    currentUser.uid,
                                    subject,
                                    subjectOrder
                                  )
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
              </Navbar.Collapse>
            </div>
          </Navbar>
        </div>
        <Container fluid>
          <div style={{height:"3rem"}}/>
          {displayedSubjects(subjectId)}
        </Container>
      </Container>
    </div>
  );
}
