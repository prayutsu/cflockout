import React from "react";
import { AiFillLinkedin } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="w-full p-[2px] flex items-center gap-4 md:gap-8 justify-center bottom-0 mx-0 text-center z-50 bg-zinc-800 text-white">
      <h1 className="text-sm tracking-wide">
        Made with <span>&#10084;</span> by Abhay Garg
        <span></span>
      </h1>

      <a
        href="https://www.linkedin.com/in/prayutsu/"
        rel="noreferrer"
        target="_blank"
      >
        <AiFillLinkedin className="cursor-pointer" />
      </a>
    </div>
  );
};

export default Footer;
