import { useState } from "react";
import { useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "./../config/firebase-config";
import axios from "axios";

require("dotenv").config();

function FirebaseTest(props) {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [userLoginToken, setUserLoginToken] = useState(null);
  const [user, setUser] = useState({});
  const [data, setData] = useState("");

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  useEffect(() => {
    if (userLoginToken) {
      fetchData(userLoginToken);
    }
  }, [userLoginToken]);

  const fetchData = async (userToken) => {
    const res = await axios.get("http://localhost:4000/firebaseTest", {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    });
    setData(res.data.data);
  };

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      setUserLoginToken(user.user.accessToken);
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    setUserLoginToken(null);
    await signOut(auth);
  };

  if (!userLoginToken) {
    return (
      <div>
        <div>
          <h3> Register User </h3>
          <input
            placeholder="Email..."
            onChange={(event) => {
              setRegisterEmail(event.target.value);
            }}
          />
          <input
            placeholder="Password..."
            onChange={(event) => {
              setRegisterPassword(event.target.value);
            }}
          />

          <button onClick={register}> Create User</button>
        </div>

        <div>
          <h3> Login </h3>
          <input
            placeholder="Email..."
            onChange={(event) => {
              setLoginEmail(event.target.value);
            }}
          />
          <input
            placeholder="Password..."
            onChange={(event) => {
              setLoginPassword(event.target.value);
            }}
          />

          <button onClick={login}> Login</button>
        </div>

        <h4> User Logged In: </h4>
        {user?.email}

        <button onClick={logout}> Sign Out </button>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <button onClick={logout}> Sign Out </button>
        </div>
        {data}
      </div>
    );
  }
}

export default FirebaseTest;
