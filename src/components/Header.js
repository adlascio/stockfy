import React from 'react'
import { Button, Nav, Navbar } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const {currentUser, logout} = useAuth();
  const navigate = useNavigate();
  async function handleLogout() {
    try{
        await logout();
        navigate('/login')
    } catch(e){
        console.log('error at signing out',e)
    }
}
  return (
    <Navbar>
        <Navbar.Brand href="/">$tockfy</Navbar.Brand>
        <Nav className="me-auto">
            <Nav.Link href="/transactions">Transactions</Nav.Link>
            <Nav.Link href="/portfolio">Portfolio</Nav.Link>
            <Nav.Link href="/my-pies">My Pies</Nav.Link>
        </Nav>
        {currentUser? <Button className='btn btn-primary' onClick={handleLogout}>Logout</Button>:<Nav.Link href="/login" className='btn btn-primary bg-transparent'>Log In</Nav.Link>}
    </Navbar>
  )
}
