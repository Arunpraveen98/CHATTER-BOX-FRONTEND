import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { All_Users_Route, SERVER_HOST } from "../Routes/AllRoutes_API";
import ChatContainer from "../components/Chat_Container";
import Contacts from "../components/Chat_UsersList";
import Welcome from "../components/Welcome_Msg";
import { toast } from "react-toastify";
import Chatter_box_bg from "../assets/Chatter-box-bg.webp"
function ChatterBox() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  // ---------------------
  const toastOptions = {
    position: "top-center",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  // ---------------------
  const USER_DETAILS = JSON.parse(
    window.localStorage.getItem(`${process.env.REACT_APP_LOCALHOST_KEY}`)
  );
  // ---------------------
  useEffect(() => {
    Checking_User_Details();
  }, []);
  // ---------------------
  useEffect(() => {
    if (currentUser) {
      socket.current = io(SERVER_HOST);
      socket.current.emit("add-user", currentUser._id);
    }
    Update_UsersList_Chat();
  }, [currentUser]);
  // ---------------------
  async function Checking_User_Details() {
    try {
      if (!USER_DETAILS) {
        navigate("/login");
      } else {
        setCurrentUser(USER_DETAILS);
        setIsLoaded(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // ---------------------
  async function Update_UsersList_Chat() {
    try {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(
            `${All_Users_Route}/${currentUser._id}`,
            {
              headers: { authorization: USER_DETAILS.user_token },
            }
          );
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
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
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  // ---------------------
  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />

          {isLoaded && currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            />
          )}
        </div>
      </Container>
    </>
  );
}
export default ChatterBox;
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow-y: scroll;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 90vh;
    width: 100vw;
    background-image: url(${Chatter_box_bg});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
