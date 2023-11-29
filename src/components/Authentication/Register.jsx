import { useContext } from "react";

import { Link } from "react-router-dom";

import AuthContext from "../../contexts/autoContext";
import useForm from "../../hooks/useForm";

import Path from "../../paths";

const RegisterFormKeys = {
  Email: "email",
  Password: "password",
  Username: "username",
};

export default function Register() {
  const { registerSubmitHandler } = useContext(AuthContext);
  const { values, onChange, onSubmit } = useForm(registerSubmitHandler, {
    [RegisterFormKeys.Email]: "",
    [RegisterFormKeys.Password]: "",
    [RegisterFormKeys.ConfirmPassword]: "",
  });

  return (
    <div className="sign section--full-bg" data-bg="img/bg.jpg">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sign__content">
              {/* registration form */}
              <form onSubmit={onSubmit} className="sign__form">
                <a href="index.html" className="sign__logo">
                  <img src="img/logo.svg" alt="" />
                </a>
                <div className="sign__group">
                  <input
                    type="text"
                    className="sign__input"
                    placeholder={RegisterFormKeys.Username}
                    name={RegisterFormKeys.Username}
                    onChange={onChange}
                    values={values[RegisterFormKeys.Username]}
                  />
                </div>
                <div className="sign__group">
                  <input
                    type="text"
                    className="sign__input"
                    placeholder={RegisterFormKeys.Email}
                    name={RegisterFormKeys.Email}
                    onChange={onChange}
                    values={values[RegisterFormKeys.Email]}
                  />
                </div>
                <div className="sign__group">
                  <input
                    type="password"
                    className="sign__input"
                    placeholder={RegisterFormKeys.Password}
                    name={RegisterFormKeys.Password}
                    onChange={onChange}
                    values={values[RegisterFormKeys.Password]}
                  />
                </div>
                <button className="sign__btn" type="submit">
                  Sign up
                </button>
                <span className="sign__text">
                  Already have an account? <Link to={Path.Login}>Sign in!</Link>
                </span>
              </form>
              {/* registration form */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
