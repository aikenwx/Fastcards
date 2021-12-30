import React, { useRef, useState } from "react";
import { Alert, Form, Button, Card } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import BoxContainer from "./BoxContainer";

export default function Login() {
  const emailRef: any = useRef();
  const passwordRef: any = useRef();
  const { logIn, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await logIn(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (exception: any) {
      setError(exception.message);
    }

    setLoading(false);
  }

  return (
    <BoxContainer>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {currentUser && <Alert>{currentUser.email}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  ref={emailRef}
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  required
                ></Form.Control>
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-3" type="submit">
                Log In
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </Card.Body>
          <div className="w-100 text-center mt-2">
            Need an account?
            <Link to="/signup"> Sign Up</Link>
          </div>
        </Card>
    </BoxContainer>
  );
}
