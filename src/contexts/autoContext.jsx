import { createContext } from "react";
import { useNavigate } from "react-router-dom";

import * as firebaseServices from "../services/firebaseServices";
import usePersistedState from "../hooks/usePersistedState";
import Path from "../paths";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = usePersistedState("auth", {});

  const loginSubmitHandler = async (values) => {
    const result = await firebaseServices.loginUser(
      values.email,
      values.password
    );
    console.log(result);
    setAuth(result);
    localStorage.setItem("auth", JSON.stringify(result));
    localStorage.setItem("accessToken", result.accessToken);
    navigate(Path.Home);
  };

  const registerSubmitHandler = async (values) => {
    const result = await firebaseServices.registerUser(
      values.email,
      values.password,
      values.username
    );

    localStorage.setItem("accessToken", result.accessToken);
    setAuth(result);
    navigate(Path.Home);
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
