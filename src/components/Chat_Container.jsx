import React, { useState, useEffect, useRef } from "react";
import "../Style_Sheet/Chat_Container.css";
import Logout from "./Logout_User";
import ChatInput from "./Chat_InputBox";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  Send_Message_Route,
  Recieve_Message_Route,
} from "../Routes/AllRoutes_API";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// -------------------------------------
export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const navigate = useNavigate();
  const scrollRef = useRef();
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
  useEffect(() => {
    Receive_Messages();
    Get_Current_Chat();
  }, [currentChat]);
  // ---------------------
  async function Receive_Messages() {
    try {
      if (currentChat) {
        const response = await axios.post(
          Recieve_Message_Route,
          {
            from: currentUser._id,
            to: currentChat._id,
          },
          {
            headers: { authorization: USER_DETAILS.user_token },
          }
        );
        setMessages(response.data);
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
  }
  // ---------------------
  const Get_Current_Chat = async () => {
    if (currentChat) {
      await USER_DETAILS._id;
    }
  };
  // ---------------------

  const handleSendMsg = async (msg) => {
    try {
      await axios.post(
        Send_Message_Route,
        {
          from: currentUser._id,
          to: currentChat._id,
          message: msg,
        },
        {
          headers: { authorization: USER_DETAILS.user_token },
        }
      );
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      });
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
    } catch (error) {
      // console.log(error);
      // alert(error);
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
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);
  // ---------------------
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  // ---------------------
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // ---------------------
  return (
    <>
      {currentChat && (
        <div className="Chat-Container">
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                {currentChat.avatarImage.startsWith("https://") ? (
                  <img src={currentChat.avatarImage} alt="avatar" />
                ) : (
                  <img
                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                    alt="avatar"
                  />
                )}
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>

          <div className="chat-messages">
            {messages.map((message) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    className={`message ${
                      message.fromSelf ? "sended" : "recieved"
                    }`}
                  >
                    <div className="content ">
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <ChatInput handleSendMsg={handleSendMsg} />
        </div>
      )}
    </>
  );
}
