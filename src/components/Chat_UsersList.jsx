import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "../Style_Sheet/Chat_UsersList.css";
import Logo from "../assets/chat-icon.png";
import { useNavigate } from "react-router-dom";
// ---------------------
export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [NoAvatar, setNoAvatar] = useState(true);
  const navigate = useNavigate();
  // ---------------------
  const USER_DETAILS = JSON.parse(
    window.localStorage.getItem(`${process.env.REACT_APP_LOCALHOST_KEY}`)
  );
  // ---------------------
  useEffect(() => {
    Current_User_Data();
  }, []);
  // ---------------------
  async function Current_User_Data() {
    try {
      setCurrentUserName(USER_DETAILS.username);
      if (USER_DETAILS.avatarImage.startsWith("https://")) {
        setNoAvatar(false);
        setCurrentUserImage(USER_DETAILS.avatarImage);
      } else {
        setNoAvatar(true);
        setCurrentUserImage(USER_DETAILS.avatarImage);
      }
    } catch (error) {
      console.log(error);
    }
  }
  // ---------------------
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  // ---------------------
  const Logout_user = () => {
    window.localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY);
    navigate("/login");
  };
  // ---------------------
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Chatter Box </h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    {contact.avatarImage.startsWith("https://") ? (
                      <img src={contact.avatarImage} alt="avatar" />
                    ) : (
                      <img
                        src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                        alt="avatar"
                      />
                    )}
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                    <span className={`status ${contact.status}`}>
                      {contact.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <button className="avatar">
              {NoAvatar ? (
                <img
                  src={`data:image/svg+xml;base64,${currentUserImage}`}
                  alt="avatar"
                  onClick={() => Logout_user()}
                />
              ) : (
                <img
                  src={currentUserImage}
                  alt="avatar"
                  onClick={() => Logout_user()}
                />
              )}
              <span className="logout-tooltip">Logout</span>
            </button>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-image: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(100, 43, 115, 1) 90%,
    rgba(4, 0, 4, 1) 10%
  );

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
    }
  }
`;
