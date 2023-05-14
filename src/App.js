import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectAvatar from "./pages/Select_Avatar";
import ChatterBox from "./pages/Chat_Box";
import USER_REGISTER from "./pages/Register_User";
import USER_LOGIN from "./pages/Login_User";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// ---------------------
function App() {
  return (
    <>
      {/* ---------- */}
      <ToastContainer
        position="top-center"
        autoClose={true}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* ---------- */}
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<USER_REGISTER />} />
          <Route path="/login" element={<USER_LOGIN />} />
          <Route path="/setAvatar" element={<SelectAvatar />} />
          <Route path="/" element={<ChatterBox />} />
        </Routes>
      </BrowserRouter>
      {/* ---------- */}
    </>
  );
}

export default App;
