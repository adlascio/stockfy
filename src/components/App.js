import React from 'react';
import '../App.css';

import Dashboard from './Dashboard';
import Signup from './Signup';
import Login from './Login';
import { AuthProvider} from '../contexts/AuthContext';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './ForgotPassword';
import UpdateProfile from './UpdateProfile';
import Transactions from './Transactions';
import MyPies from './MyPies';
import Portfolio from './Portfolio';
import Aside from './Aside';
import Profile from './Profile';

function App() {
  return (
      <div className='app'>
        <Router>
          <AuthProvider>
            <Aside />
            <div>
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
                <Route 
                  path='/transactions' 
                  element={
                    <PrivateRoute>
                      <Transactions/>
                    </PrivateRoute>                    
                  }
                />
                <Route 
                  path='/my-pies' 
                  element={
                    <PrivateRoute>
                      <MyPies/>
                    </PrivateRoute>                    
                  }
                />
                <Route 
                  path='/portfolio' 
                  element={
                    <PrivateRoute>
                      <Portfolio/>
                    </PrivateRoute>                    
                  }
                />
                <Route 
                  path='/profile' 
                  element={
                    <PrivateRoute>
                      <Profile/>
                    </PrivateRoute>                    
                  }
                />
              </Routes>
            </div>
            
          </AuthProvider>
        </Router>
      </div>
        
  );
}

export default App;
