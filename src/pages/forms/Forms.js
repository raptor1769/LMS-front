import "./Forms.scss";
import { useState } from "react";
import Register from "../../components/Register/Register";
import Login from "../../components/Login/Login";

const Forms = () => {
  const [formName, setFormName] = useState("login");

  return (
    <div className='login'>
      <div className='image-container'>
        <img
          src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp'
          alt='sample pic'
          className='login-image'
          width='60%'
        />
      </div>
      <div className='form-container'>
        {formName === "login" ? (
          <Login setFormName={setFormName} />
        ) : (
          <Register setFormName={setFormName} />
        )}
      </div>
    </div>
  );
};

export default Forms;
