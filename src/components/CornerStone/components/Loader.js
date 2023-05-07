import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        height: 0,
        width: 0,
        padding: 15,
        border: "6px solid #ccc",
        borderRightColor: "#888",
        borderRadius: 22,
        animation: "rotate 1s infinite linear"
      }}
      className="loading"
    ></div>
  );
};

export default Loader;
