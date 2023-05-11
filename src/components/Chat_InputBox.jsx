import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import "../Style_Sheet/Chat_InputBox.css";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useNavigate } from "react-router-dom";

// ---------------------
export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef();
  const navigate = useNavigate();
  // ---------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  // ---------------------
  const handleEmojiPickerhideShow = async () => {
    try {
      setShowEmojiPicker(!showEmojiPicker);
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };
  // ---------------------
  const handleEmojiClick = (emojiObject) => {
    let message = msg;
    message += emojiObject.native;
    setMsg(message);
  };

  // ---------------------

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      const currentDate = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      };
      const currentTime = currentDate.toLocaleTimeString("en-US", options);
      const messageWithTime = `${msg} ${currentTime}`;

      handleSendMsg(messageWithTime);
      setMsg("");
    }
  };

  // ---------------------
  return (
    <div className="chat-input-container">
      <div className="button-container">
        <div className="emoji" ref={emojiRef}>
          <BsEmojiSmileFill
            className="emoji-icon"
            onClick={handleEmojiPickerhideShow}
          />
          {showEmojiPicker ? (
            <Picker
              data={data}
              className="emoji-picker"
              onEmojiSelect={handleEmojiClick}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Type your message . . ."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className="message-input"
        />
        <button type="submit" className="send-button">
          <AiOutlineSend className="send-icon" />
        </button>
      </form>
    </div>
  );
}
