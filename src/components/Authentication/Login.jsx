import { Link } from "react-router-dom";
import Path from "../../paths";

export default function Login() {
  return (
    <div className="sign section--full-bg" data-bg="img/bg.jpg">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="sign__content">
              {/* authorization form */}
              <form action="#" className="sign__form">
                <a href="index.html" className="sign__logo">
                  <img src="src/assets/logo.png" alt="" />
                </a>
                <div className="sign__group">
                  <input
                    type="text"
                    className="sign__input"
                    placeholder="Email"
                  />
                </div>
                <div className="sign__group">
                  <input
                    type="password"
                    className="sign__input"
                    placeholder="Password"
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
