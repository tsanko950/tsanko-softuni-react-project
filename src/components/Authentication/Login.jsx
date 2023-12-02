import { useContext } from "react";
import { Link } from "react-router-dom";
import Path from "../../paths";
import AuthContext from "../../contexts/autoContext";
import useForm from "../../hooks/useForm";

const LoginFormKyes = {
  Email: "email",
  Password: "password",
};

export default function Login() {
  const { loginSubmitHandler, isAuthenticated } = useContext(AuthContext);
  const { values, onChange, onSubmit } = useForm(loginSubmitHandler, {
    [LoginFormKyes.Email]: "",
    [LoginFormKyes.Password]: "",
  });
  if (isAuthenticated) {
    navigate(Path.Home);
  }

  return (
    <div className="sign section--full-bg" data-bg="img/bg.jpg">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sign__content">
              {/* authorization form */}
              <form id="login" onSubmit={onSubmit} className="sign__form">
                <a href="index.html" className="sign__logo">
                  <img src="src/assets/logo.png" alt="" />
                </a>
                <div className="sign__group">
                  <input
                    type="text"
                    className="sign__input"
                    name={LoginFormKyes.Email}
                    placeholder="example@mail.com"
                    onChange={onChange}
                    value={values[LoginFormKyes.Email]}
                  />
                </div>
                <div className="sign__group">
                  <input
                    type="password"
                    className="sign__input"
                    placeholder="Password"
                    name={LoginFormKyes.Password}
                    onChange={onChange}
                    value={values[LoginFormKyes.Password]}
                  />
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
