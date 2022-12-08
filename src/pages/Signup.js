import React, { useRef, useState } from "react";
import { Button, Card, Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    console.log("submiting");
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
      return setError("Passwords do not match.");
    }
    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (e) {
      console.log("error at creating an account", e);
      setError("Failed to create an account.");
    }
    setLoading(false);
  }
  if (currentUser) return <Navigate to="/" />;

  return (
    <div className="signup__container">
      <div className="signup__content">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
              <Form.Group className="signup__form-group" id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group className="signup__form-group" id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Form.Group
                className="signup__form-group"
                id="passwordConfirmation"
              >
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmationRef}
                  required
                />
              </Form.Group>
              <Button
                className="signup__button"
                disabled={loading}
                onClick={(e) => handleSubmit(e)}
              >
                Sign Up
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="signup__footer">
          Already have an account? <Link to="/login">Sign in.</Link>
        </div>
      </div>
    </div>
  );
}
