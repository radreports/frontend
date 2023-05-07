import React from "react";

const Button = ({ className, children, ...rest }) => {
  return (
    <button
      type="button"
      className={`text-2xl bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded  ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
