import React, { useRef, useState } from "react";
import { Button, Card, Form, Container, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const { updateUserPassword, currentUser } = useAuth();
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
      if (passwordRef.current.value) {
        await updateUserPassword(passwordRef.current.value);
      }
      navigate("/");
    } catch (e) {
      console.log("error at updating profile", e);
      setError("Failed to update profile.");
    }
    setLoading(false);
  }
  return (
    <div className="signup__container">
      <div className="signup__content">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Update Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
              <Form.Group className="signup__form-group" id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  ref={emailRef}
                  required
                  defaultValue={currentUser.email}
                  disabled
                />
              </Form.Group>
              <Form.Group className="signup__form-group" id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Leave blank to keep the same password"
                />
              </Form.Group>
              <Form.Group
                className="signup__form-group"
                id="passwordConfirmation"
              >
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmationRef}
                  placeholder="Leave blank to keep the same password"
                />
              </Form.Group>
              <Button
                className="signup__button"
                disabled={loading}
                onClick={(e) => handleSubmit(e)}
              >
                Update Profile
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="signup__footer">
          <Link to="/">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
