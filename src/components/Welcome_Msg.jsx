import React from "react";
import "../Style_Sheet/Welcome_Msg.css";
export default function Welcome({ currentUser }) {
  // ---------------------
  let Logged_in_user = currentUser.username;
  // ---------------------
  return (
    <div className="welcome-container">
      <lottie-player
        src="https://assets10.lottiefiles.com/packages/lf20_qwl4gi2d.json"
        background="transparent"
        speed="1"
        style={{ width: "200px", height: "210px" }}
        loop
        autoplay
        className="welcome-img"
      ></lottie-player>
      <div className="message-div">
        <h1>
          Welcome, <span className="user-name">{Logged_in_user}!</span>
        </h1>
        <h3 className="welcome-description">
          Please select a chat to Start messaging.
        </h3>
      </div>
    </div>
  );
}
