import axios from "axios";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { hideAlert, showAlert } from "../../redux/AlertSlice";
import { loaderStart, loaderStop } from "../../redux/LoaderSlice";
import "./Register.scss";

const Register = ({ setFormName }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const dispatch = useDispatch();

  const handleFormChange = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    setFormName("login");
  };

  const registerCall = async (body) => {
    dispatch(loaderStart());
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND}/auth/register`, body);
      dispatch(
        showAlert({
          type: "success",
          message: `Registered Successfully, please login`,
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1500);
      handleFormChange();
    } catch (err) {
      console.log(err);
      if (err.response.data.code === 11000) {
        dispatch(
          showAlert({
            type: "warning",
            message: "Email already registered, please login",
          })
        );
        setTimeout(() => {
          dispatch(hideAlert());
          handleFormChange();
        }, 1000);
      } else {
        dispatch(
          showAlert({
            type: "danger",
            message: "Something went wrong, try again",
          })
        );
        setTimeout(() => dispatch(hideAlert()), 1000);
      }
    }
    dispatch(loaderStop());
  };

  const handleRegister = (e) => {
    e.preventDefault();
    //eslint-disable-next-line
    const nameRegex = /^[a-zA-Z]+$/;
    //eslint-disable-next-line
    const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!name.match(nameRegex)) {
      dispatch(
        showAlert({
          type: "warning",
          message: "Name should contain only letters",
        })
      );
      setTimeout(() => dispatch(hideAlert()), 1000);
      return;
    }

    if (!email.match(validEmailRegex)) {
      dispatch(
        showAlert({
          type: "warning",
          message: "Invalid email",
        })
      );
      setTimeout(() => dispatch(hideAlert()), 1000);
      return;
    }

    if (password.length <= 7) {
      dispatch(
        showAlert({
          type: "warning",
          message: "Min password length: 8",
        })
      );
      setTimeout(() => dispatch(hideAlert()), 1000);
      return;
    }

    if (role.length === 0) {
      dispatch(
        showAlert({
          type: "warning",
          message: "Select role",
        })
      );
      setTimeout(() => dispatch(hideAlert()), 1000);
      return;
    }

    //Post
    let bodyObj = {
      name: name,
      email: email,
      password: password,
      role: role,
    };
    registerCall(bodyObj);
  };

  return (
    <form className="login-form">
      <p className="form-heading">Register</p>
      <div className="input-container">
        <input
          type="text"
          placeholder="Name"
          name="name"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="input-container">
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="input-container">
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="input-container">
        <select
          name="user-type"
          id="user-type"
          defaultValue="0"
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="0" disabled className="selected">
            Teacher/Student
          </option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>
      <Button
        variant="primary"
        className="register-button"
        onClick={handleRegister}
      >
        Register
      </Button>
      <p className="form-footer">
        Already have an account?{" "}
        <span href="" className="form-link" onClick={handleFormChange}>
          Login
        </span>
      </p>
    </form>
  );
};

export default Register;
