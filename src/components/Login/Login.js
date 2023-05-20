import axios from "axios";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loaderStart, loaderStop } from "../../redux/LoaderSlice";
import "./Login.scss";
import { loginFailure, loginSuccess } from "../../redux/AuthSlice";
import { hideAlert, showAlert } from "../../redux/AlertSlice";

const Login = ({ setFormName }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const loginCall = async (body) => {
    dispatch(loaderStart());
    try {
      const user = await axios.post(
        `${process.env.REACT_APP_BACKEND}/auth/login`,
        body
      );
      localStorage.setItem("user", JSON.stringify(user.data));
      dispatch(showAlert({ type: "success", message: "Login success" }));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      dispatch(loginSuccess(user.data));
    } catch (err) {
      dispatch(showAlert({ type: "danger", message: err.response.data }));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      dispatch(loginFailure(err.response.data));
    }
    dispatch(loaderStop());
  };

  const handleLogin = () => {
    //eslint-disable-next-line
    const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email.match(validEmailRegex)) {
      dispatch(showAlert({ type: "danger", message: "Invalid email" }));
      setTimeout(() => dispatch(hideAlert()), 2000);
      return;
    }

    let bodyObj = {
      email: email,
      password: password,
    };
    loginCall(bodyObj);
  };

  const handleClick = () => {
    setEmail("");
    setPassword("");
    setFormName("register");
  };
  return (
    <>
      <form className="login-form">
        <p className="form-heading">Login</p>
        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            required
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="Password"
            required
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          variant="primary"
          className="login-button"
          onClick={handleLogin}
        >
          Login
        </Button>
        <p className="form-footer">
          Don't have an account?{" "}
          <span href="" className="form-link" onClick={handleClick}>
            Register
          </span>
        </p>
      </form>
    </>
  );
};

export default Login;
