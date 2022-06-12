import { ClipboardCopyIcon } from "@heroicons/react/outline";
import React, { useState } from "react";

const CopyButton = () => {
  const [isTextCopied, setIsTextCopied] = useState(false);

  const handleOnClick = (e) => {
    e.preventDefault();
    const id = document.getElementById("livecontest-id").innerText.toString();
    navigator.clipboard.writeText(id);
    setIsTextCopied(true);
    setTimeout(() => {
      setIsTextCopied(false);
    }, 2000);
  };
  return (
    <>
      {isTextCopied ? (
        <h3 className="absolute -mt-10 -ml-2 text-center text-xs text-semibold text-gray-800">
          Copied!
        </h3>
      ) : (
        <></>
      )}
      <ClipboardCopyIcon
        onClick={handleOnClick}
        className="text-gray-500 hover:text-cyan-900"
      />
    </>
  );
};

export default CopyButton;
