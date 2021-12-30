import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import firebase from "firebase/compat";

const DatabaseContext: React.Context<any> = React.createContext("");

export function useAuth() {
  return useContext(DatabaseContext);
}

export function DatabaseProvider({ children }: any) {
  const [currentUser, setCurrentUser]: any = useState();
  const [loading, setLoading] = useState(true);
  
  const createUser = () => {
      const userRef = firebase.database().ref("User");
      const user = currentUser;
      userRef.push(user) 
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {!loading && children}
    </DatabaseContext.Provider>
  );
}