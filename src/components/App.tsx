import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Dashboard from "./Dashboard";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import SignedInRoute from "./SignedInRoute";
import Signup from "./Signup";
import UpdateProfile from "./UpdateProfile";

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
