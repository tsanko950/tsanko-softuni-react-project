import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import * as firebaseServices from "../services/firebaseServices";
import usePersistedState from "../hooks/usePersistedState";
import Path from "../paths";
import { getFirebaseAuthErrorMessage } from "../utils/firestoreErrors";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = usePersistedState("auth", {});
  const [loginRegisterError, setLoginRegisterError] = useState();

  const loginSubmitHandler = async (values) => {
    setLoginRegisterError("");
    try {
      const result = await firebaseServices.loginUser(
        values.email,
        values.password
      );
      if (result.accessToken) {
        setLoginRegisterError("");
        setAuth(result);
        localStorage.setItem("auth", JSON.stringify(result));
        localStorage.setItem("accessToken", result.accessToken);
        navigate(Path.Home);
      } else {
        // ERROR DE LOGIN
        let errorLogin = getFirebaseAuthErrorMessage(result);
        console.log(errorLogin);
        setLoginRegisterError(errorLogin);
      }
    } catch (error) {
      console.error(error);
      setLoginRegisterError(getFirebaseAuthErrorMessage(error.code));
    }
  };

  const registerSubmitHandler = async (values) => {
    setLoginRegisterError("");
    const result = await firebaseServices.registerUser(
      values.email,
      values.password,
      values.username
    );

    if (result.accessToken) {
      setLoginRegisterError("");
      localStorage.setItem("accessToken", result.accessToken);
      setAuth(result);
      navigate(Path.Home);
    } else {
      let errorRegister = getFirebaseAuthErrorMessage(result);
      console.log(result);
      setLoginRegisterError(errorRegister);
    }
  };

  const logoutHandler = () => {
    setAuth({});
    localStorage.removeItem("accessToken");
    localStorage.removeItem("auth");
  };
  // console.log(auth.stsTokenManager.accessToken);
  const values = {
    loginSubmitHandler,
    registerSubmitHandler,
    logoutHandler,
    loginRegisterError,
    username: auth.username || auth.email,
    email: auth.email,
    userId: auth.uid,
    isAuthenticated: !!auth.accessToken,
    isAdmin: !!auth.isAdmin,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

AuthContext.displayName = "AuthContext";

export default AuthContext;
// https://t.me/ReactJS23SoftUni
// https://t.me/+VN2i12PAynpiNDBk
