import React from "react";
import Signup from "./Signup";
import { AuthProvider } from "../contexts/AuthContext";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import SignedInRoute from "./SignedInRoute";


function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <SignedInRoute>
                  <Signup />
                </SignedInRoute>
              }
            />
            <Route
              path="/login"
              element={
                <SignedInRoute>
                  <Login />
                </SignedInRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <SignedInRoute>
                  <ForgotPassword />
                </SignedInRoute>
              }
            />
            <Route
              path="/update-profile"
              element={
                <PrivateRoute>
                  <UpdateProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/:subjectId"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
