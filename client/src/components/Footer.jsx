import React from "react";
import { AiFillLinkedin, AiOutlineGithub } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="w-full p-[2px] mt-auto flex items-center gap-4 justify-center mx-0 bottom-0 text-center z-50 bg-zinc-800 text-white">
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

      <a
        href="https://github.com/prayutsu/cflockout"
        rel="noreferrer"
        target="_blank"
      >
        <AiOutlineGithub className="cursor-pointer" />
      </a>
    </div>
  );
};

export default Footer;
