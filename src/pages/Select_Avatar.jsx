import React, { useEffect, useState } from "react";
import "../Style_Sheet/Select_Avatar.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import loader from "../assets/spinner.gif";
import { useNavigate } from "react-router-dom";
import { Set_Avatar_Route } from "../Routes/AllRoutes_API";
import { Set_DefaultAvatar_Route } from "../Routes/AllRoutes_API";
import { toast } from "react-toastify";

export default function SetAvatar() {
  // ---------------------
  var Buffer = require("buffer/").Buffer;
  const api = process.env.REACT_APP_AVATAR_API;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [NoAvatar, setNoAvatar] = useState(true);
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
    if (USER_DETAILS.avatarImage !== "") {
      navigate("/");
    } else {
      Fetch_Avatars();
      // Get_Avatar_Image();
    }
    // console.log(GET_USER_DATA);
  }, []);
  // ---------------------
  const setProfilePicture = async () => {
    try {
      // ---------------------
      if (selectedAvatar === undefined) {
        toast.error("Please select an avatar", toastOptions);
      } else {
        const data = await axios.post(
          `${Set_Avatar_Route}/${USER_DETAILS._id}`,
          {
            image: avatars[selectedAvatar],
          },
          {
            headers: { authorization: USER_DETAILS.user_token },
          }
        );
        // ---------------------
        // console.log(data);
        // console.log(data.data.isSet);
        // ---------------------
        if (data.data.isSet) {
          USER_DETAILS.isAvatarImageSet = true;
          USER_DETAILS.avatarImage = data.data.image;
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(USER_DETAILS)
          );
          toast.success("Your 🤷‍♂️Profile has been updated", toastOptions);
          navigate("/");
        } else {
          toast.error("Error setting avatar. Please try again.", toastOptions);
        }
        // ---------------------
      }
    } catch (error) {
      console.lg(error);
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
  async function Fetch_Avatars() {
    const data = [];
    for (let i = 0; i < 5; i++) {
      try {
        const image = await axios.get(
          `${api}&${Math.round(Math.random() * 1000)}`
        );

        const buffer = Buffer.from(image.data);

        data.push(buffer.toString("base64"));

        // console.log(data);
        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        if (data.length === 0) {
          setNoAvatar(false);
          Get_Avatar_Image();
        }
      }
    }
  }
  // ---------------------
  const Get_Avatar_Image = async () => {
    try {
      const Get_Default_Avatar_Image = await axios.get(
        `${Set_DefaultAvatar_Route}`,
        {
          headers: { authorization: USER_DETAILS.user_token },
        }
      );
      const avatars_setting = [];
      const avatar_map = await Get_Default_Avatar_Image.data.map((img) =>
        avatars_setting.push(img.Avatar_Img)
      );
      // console.log(avatars_setting);
      setAvatars(avatars_setting);
      setIsLoading(false);
      // console.log(Get_Default_Avatar_Image.data);
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
    <>
      {isLoading ? (
        <div className="Avatar-Container">
          <img
            src={loader}
            style={{ width: "150px", height: "150px" }}
            alt="loader"
            className="loader"
          />
        </div>
      ) : (
        <div className="Avatar-Container" key={uuidv4()}>
          <div className="title-container">
            <h1>Select an Avatar as your profile picture.</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={
                      NoAvatar
                        ? `data:image/svg+xml;base64,${avatar}`
                        : `${avatar}`
                    }
                    alt="avatar"
                    key={index}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
        </div>
      )}
    </>
  );
}
