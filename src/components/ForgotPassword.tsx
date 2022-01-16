import React, { useRef, useState } from "react";
import { Alert, Form, Button, Card } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import BoxContainer from "./BoxContainer";

export default function ForgotPassword() {
  const emailRef: any = useRef();
  const { currentUser, resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch (exception: any) {
      setError(exception.message);
    }

    setLoading(false);
  }

  return (
    <BoxContainer
      children={
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Password Reset</h2>
            {currentUser && <Alert>{currentUser.email}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
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
              <Button
                disabled={loading}
                className="w-100 mt-3"
                type="submit"
                variant="dark"
              >
                Reset Password
              </Button>
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/login">Login</Link>
            </div>
          </Card.Body>
          <div className="w-100 text-center mt-2">
            Need an account?
            <Link to="/signup"> Sign Up</Link>
          </div>
        </Card>
      }
    />
  );
}
