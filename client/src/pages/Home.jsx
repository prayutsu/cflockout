import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { changeIndex } from "../features/nav/navSlice";
import { ReactComponent as CflockoutLogo } from "../components/assets/cflockout-logo-icon.svg";


const Home = () => {
  
  useEffect(() => {
    changeIndex(0);
  }, []) // eslint-disable-line

  return (
    // <div className="h-screen w-full">
      <div className="h-full w-full"> 
      {/* <CflockoutLogo /> */}
      </div>
    // </div>
  );
};

export default Home;
