import React, { useState } from "react";
import "../Style_Sheet/Login_User.css";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { Login_Route } from "../Routes/AllRoutes_API";
import { toast } from "react-toastify";
// ----------------------
const USER_LOGIN = () => {
  // ----------------------
  //? React Hooks...
  const [Spinner, setSpinner] = useState(true);
  // ----------------------
  //? React-router-dom Hook...
  const navigate = useNavigate();
  // ----------------------
  //? React toastify...
  const toastOptions = {
    position: "top-center",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // ----------------------
  //? Formik for Form Validations...
  const My_Formik = useFormik({
    initialValues: {
      Email: "",
      Password: "",
    },
    validate: (values) => {
      let errors = {};
      // ---------------------------------------
      //? EMAIL ...
      if (!values.Email) {
        errors.Email = "Please enter your email";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.Email)
      ) {
        errors.Email = "Invalid email address";
      }
      // ----------------------------------------
      //? PASSWORD ...
      if (!values.Password) {
        errors.Password = "Please enter your Password";
      }
      // ---------------------------------------
      return errors;
    },
    onSubmit: async (values) => {
      try {
        // ----------------------
        setSpinner(false);
        // ----------------------

        const User_Login = await axios.post(`${Login_Route}`, values);
        // ----------------------
        // console.log(User_Login);
        if (`${User_Login.data.response.user_token}`) {
          // ----------------------
          const USER_DATA = JSON.stringify(User_Login.data.response);
          window.localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            USER_DATA
          );
          toast.success(User_Login.data.message, toastOptions);
          //   console.log(USER_DATA);
          //   ----------------------
          setSpinner(true);
          navigate("/setAvatar");

          //   ----------------------
        }
        // ----------------------
      } catch (errors) {
        console.log(errors.response.data.message);
        if (errors.response.status === 422) {
          toast.error(errors.response.data.message, toastOptions);
        }
        if (errors.response.status === 401) {
          toast.error(errors.response.data.message, toastOptions);
        }

        My_Formik.resetForm();
        setSpinner(true);
      }
    },
  });
  // ----------------------
  return (
    <>
      <div className="login-bg">
        <div className="container">
          <div className="row">
            <div className="col-md-12 login-div">
              <div className="Login-form-container">
                <div className="chat-name">CHATTER BOX</div>
                <p className="Login-title">Login</p>
                {/* -------------------------------- */}
                <form className="Login-form" onSubmit={My_Formik.handleSubmit}>
                  {/* -------------------------------- */}
                  {/* EMAIL */}
                  <div className="input-group">
                    <label htmlFor="Email">Email</label>
                    <input
                      type="email"
                      name="Email"
                      id="Email"
                      placeholder="Enter your email address"
                      value={My_Formik.values.Email}
                      onChange={My_Formik.handleChange}
                    />
                    {
                      <span
                        style={{
                          color: "rgb(229, 55, 35)",
                          fontSize: "10px",
                          fontFamily: "Philosopher, sans-serif",
                          letterSpacing: "1px",
                        }}
                      >
                        {My_Formik.errors.Email}
                      </span>
                    }
                  </div>
                  {/* -------------------------------- */}
                  {/* PASSWORD */}
                  <div className="input-group">
                    <label htmlFor="Password">Password</label>
                    <input
                      type="password"
                      name="Password"
                      id="Password"
                      placeholder="Enter your password"
                      value={My_Formik.values.Password}
                      onChange={My_Formik.handleChange}
                    />
                    {
                      <span
                        style={{
                          color: "rgb(229, 55, 35)",
                          fontSize: "10px",
                          fontFamily: "Philosopher, sans-serif",
                          letterSpacing: "1px",
                        }}
                      >
                        {My_Formik.errors.Password}
                      </span>
                    }
                  </div>
                  {/* -------------------------------- */}
                  <div className="forgot">
                    <Link rel="noopener noreferrer" href="#">
                      Forgot Password ?
                    </Link>
                  </div>
                  {/* -------------------------------- */}
                  <button type={"submit"} value={"Login"} className="sign">
                    {Spinner ? (
                      "Login"
                    ) : (
                      <div className="spinner-div">
                        <div className="spinner"></div>
                      </div>
                    )}
                  </button>
                  {/* -------------------------------- */}
                </form>
                {/* -------------------------------- */}
                <div className="social-message">
                  <div className="line"></div>
                  <p className="message">Don't have an account?</p>
                  <div className="line"></div>
                </div>
                {/* -------------------------------- */}
                <p className="signup">
                  <Link to={"/register"} className="">
                    Sign up
                  </Link>
                </p>
                {/* -------------------------------- */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default USER_LOGIN;
