import { Link, useNavigate } from "react-router-dom";
import Path from "../../paths";
import * as firebaseServices from "../../services/firebaseServices";
import { useContext, useEffect } from "react";
import AuthContext from "../../contexts/autoContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logoutHandler, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    navigate(Path.Home);
  }

  useEffect(() => {
    firebaseServices
      .logoutUser()
      .then(() => {
        logoutHandler();
        navigate(Path.Home);
      })
      .catch(() => {
        logoutHandler();
        navigate(Path.Home);
      });
  }, []);

  return null;
}
