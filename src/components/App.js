import React from 'react';
import { Container } from 'react-bootstrap';
import '../App.css';

import Dashboard from './Dashboard';
import Signup from './Signup';
import Login from './Login';
import { AuthProvider } from '../contexts/AuthContext';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './ForgotPassword';
import UpdateProfile from './UpdateProfile';

function App() {

  return (
      <Container>
        <Router>
          <AuthProvider>
            <Routes>
              <Route 
                exact path='/' 
                element={
                  <PrivateRoute>
                    <Dashboard/>
                  </PrivateRoute>                    
                }
              />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route 
                path='/update-profile' 
                element={
                  <PrivateRoute>
                    <UpdateProfile/>
                  </PrivateRoute>                    
                }
              />
            </Routes>
          </AuthProvider>
        </Router>
      </Container>
  );
}

export default App;
