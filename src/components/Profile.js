import React, { useState } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.log('error at signing out', e);
      setError('Failed at signing out.');
    }
  }
  return (
    <div>
      <div className='signup__container'>
        <div className='signup__content'>
          <Card>
            <Card.Body>
              <h2 className='text-center mb-4'>Profile</h2>
              {error && <Alert variant='danger'>{error}</Alert>}
              <strong>Email: </strong>
              {currentUser.email}
              <Link to='/update-profile' className='btn btn-primary w-100 mt-3'>
                Update Profile
              </Link>
            </Card.Body>
          </Card>
          <div className='w-100 text-center mt-2'>
            <Button variant='link' onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
