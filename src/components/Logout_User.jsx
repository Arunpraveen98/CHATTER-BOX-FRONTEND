import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import styled from "styled-components";
import axios from "axios";
import { Logout_Route } from "../Routes/AllRoutes_API";
import { toast } from "react-toastify";
export default function Logout() {
  // ---------------------
  const USER_DETAILS = JSON.parse(
    window.localStorage.getItem(`${process.env.REACT_APP_LOCALHOST_KEY}`)
  );

  // ---------------------
  const toastOptions = {
    position: "top-center",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  // ---------------------
  const navigate = useNavigate();
  // ---------------------
  const Logout_Current_User = async () => {
    try {
      const id = USER_DETAILS._id;
      const data = await axios.get(`${Logout_Route}/${id}`, {
        headers: { authorization: USER_DETAILS.user_token },
      });
      if (data.status === 200) {
        localStorage.clear();
        toast.success("👋Successfully logged-out", toastOptions);
        navigate("/login");
      }
    } catch (error) {
      // console.log(error);
      console.log(error.response.data.error.message);
      if (error.response.data.error.message === "jwt expired") {
        window.localStorage.removeItem(
          `${process.env.REACT_APP_LOCALHOST_KEY}`
        );
        navigate("/login");
        toast.error(
          "Session Timeout.Please Login again to Continue",
          toastOptions
        );
      }
    }
  };
  // ---------------------
  return (
    <Button onClick={Logout_Current_User}>
      <FaSignOutAlt className="chat-logout-icon" />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: red;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
  .chat-logout-icon {
    filter: contrast(150%);
    filter: drop-shadow(2px 2px 2px #141414);
  }
`;
