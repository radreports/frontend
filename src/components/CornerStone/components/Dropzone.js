import React from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({
  onDrop,
  accept,
  noClick,
  className,
  children,
  ...rest
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick,
    onDrop,
    accept,
    multiple: false
  });

  return (
    <div
      className={`${className} ${
        isDragActive ? "bg-gray-600 bg-opacity-25" : ""
      }`}
      {...rest}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {/* {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop a file here, or click to select file</p>
      )} */}
      {children}
    </div>
  );
};

export default Dropzone;
