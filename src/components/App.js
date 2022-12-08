import React from "react";
import "../App.css";

import Dashboard from "../pages/Dashboard";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import { AuthProvider } from "../contexts/AuthContext";
import { TransactionsProvider } from "../contexts/TransactionsContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "../pages/ForgotPassword";
import UpdateProfile from "../pages/UpdateProfile";
import Transactions from "../pages/Transactions";
import MyPies from "../pages/MyPies";
import Portfolio from "../pages/Portfolio";
import Aside from "./Aside";
import Profile from "../pages/Profile";

function App() {
  return (
    <div className="app">
      <Router>
        <AuthProvider>
          <Aside />
          <TransactionsProvider>
            <div>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/update-profile"
                  element={
                    <PrivateRoute>
                      <UpdateProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <PrivateRoute>
                      <Transactions />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-pies"
                  element={
                    <PrivateRoute>
                      <MyPies />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/portfolio"
                  element={
                    <PrivateRoute>
                      <Portfolio />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </TransactionsProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
