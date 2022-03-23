import React, {useRef, useState} from 'react'
import { Button, Card, Form, Container, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const {login} = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        console.log('submiting')
        e.preventDefault()
        try{
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/');
        } catch(e){
            console.log('error at signing in',e)
            setError("Failed to sign in.")
        }
        setLoading(false);
        
    }
  return (
    <Container className='signup__container'>
        <div className='signup__content'>
            <Card >
                <Card.Body >
                    <h2 className='text-center mb-4'>Log In</h2>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    <Form>
                        <Form.Group className='signup__form-group' id='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' ref={emailRef} required />
                        </Form.Group>
                        <Form.Group className='signup__form-group' id='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' ref={passwordRef} required />
                        </Form.Group>
                        <Button className='signup__button' disabled={loading} onClick={(e) => handleSubmit(e)}>Log In</Button>
                    </Form>
                    <div className='w-100 text-center mt-3'>
                        <Link to='/forgot-password'>Forgot password?</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className='signup__footer'>
                Need an account? <Link to="/signup">Sign up</Link>
            </div>
        </div> 
    </Container>
  )
}
