import React, {useRef, useState} from 'react'
import { Button, Card, Form, Container, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ForgotPassword() {
    const emailRef = useRef()
    const {resetPassword} = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        console.log('submiting')
        e.preventDefault()
        try{
            setMessage("")
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            navigate('/');
            setMessage('Check your inbox for further instructions')
        } catch(e){
            console.log('error at reseting password',e)
            setError("Failed to reset password.")
        }
        setLoading(false);
        
    }
  return (
    <Container className='signup__container'>
        <div className='signup__content'>
            <Card >
                <Card.Body >
                    <h2 className='text-center mb-4'>Password Reset</h2>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    {message && <Alert variant='success'>{message}</Alert>}
                    <Form>
                        <Form.Group className='signup__form-group' id='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' ref={emailRef} required />
                        </Form.Group>
                        <Button className='signup__button' disabled={loading} onClick={(e) => handleSubmit(e)}>Reset Password</Button>
                    </Form>
                    <div className='w-100 text-center mt-3'>
                        <Link to='/login'>Login</Link>
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
