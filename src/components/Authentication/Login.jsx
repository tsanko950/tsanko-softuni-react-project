import { useContext } from "react";
import { Link } from "react-router-dom";
import Path from "../../paths";
import styles from "../Movies/CreateEditMovie.module.css";
import AuthContext from "../../contexts/autoContext";
import useForm from "../../hooks/useForm";

const LoginFormKeys = {
  Email: "email",
  Password: "password",
};

export default function Login() {
  const { loginSubmitHandler, isAuthenticated, loginRegisterError } =
    useContext(AuthContext);

  const validate = {
    [LoginFormKeys.Email]: (value) => {
      if (!value) {
        return "Email is required";
      }
      return "";
    },
    [LoginFormKeys.Password]: (value) => {
      if (!value) {
        return "Password is required";
      }
      return "";
    },
  };

  const { values, errors, onChange, onSubmit, resetForm } = useForm(
    loginSubmitHandler,
    {
      [LoginFormKeys.Email]: "",
      [LoginFormKeys.Password]: "",
    },
    validate
  );

  if (isAuthenticated) {
    navigate(Path.Home);
  }

  return (
    <div
      className="sign section--full-bg"
      style={{ backgroundImage: "../src/img/bg.jpg" }}
      data-bg="../src/img/bg.jpg"
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sign__content">
              {/* authorization form */}
              <form id="login" onSubmit={onSubmit} className="sign__form">
                <a href="#" className="sign__logo">
                  <img src="src/img/logo.png" alt="" />
                </a>
                {loginRegisterError && (
                  <p className={styles.errorMessage}>{loginRegisterError}</p>
                )}
                <div className="sign__group">
                  <input
                    type="text"
                    className="sign__input"
                    name={LoginFormKeys.Email}
                    placeholder="example@mail.com"
                    onChange={onChange}
                    value={values[LoginFormKeys.Email]}
                  />
                  {errors[LoginFormKeys.Email] && (
                    <p className={styles.errorMessage}>
                      {errors[LoginFormKeys.Email]}
                    </p>
                  )}
                </div>
                <div className="sign__group">
                  <input
                    type="password"
                    className="sign__input"
                    placeholder="Password"
                    name={LoginFormKeys.Password}
                    onChange={onChange}
                    value={values[LoginFormKeys.Password]}
                  />
                  {errors[LoginFormKeys.Password] && (
                    <p className={styles.errorMessage}>
                      {errors[LoginFormKeys.Password]}
                    </p>
                  )}
                </div>
                <button className="sign__btn" type="submit">
                  Sign in
                </button>
                <span className="sign__text">
                  Don't have an account?{" "}
                  <Link to={Path.Register}>Sign up!</Link>
                </span>
              </form>
              {/* end authorization form */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
