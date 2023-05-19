import { useEffect } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../top_bar/TopBar";
import LeftBar from "../left_bar/LeftBar";
import "./Container.css";

const Container = () => {
  const [loggedIn, setLoggedIn] = useState("");

  useEffect(() => {
    if (localStorage.getItem("sessionToken") != null) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div className="containerCT">
      <TopBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <LeftBar />

      <div className="container-mainCT">
        <div className="leftBar-wrapperCT">
         </div>
        <div className="contentCT">
          <Outlet loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        </div>
      </div>
    </div>
  );
};

export default Container;
