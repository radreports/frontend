import React, { useState, useCallback, useRef } from "react";
import Layout from "../components/Layout";
import Dropzone from "../components/Dropzone";
import CornerstoneElement from "../components/CornerstoneElement";
import Accordion from "../components/Accordion";
import Loader from "../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdjust,
  faEllipsisH,
  faEllipsisV,
  faUndo,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import * as cornerstone from "cornerstone-core";

import { axiosInstance } from "../middlewares/axiosInstance";

const HandlingImage = () => {
  const [imageId, setImage] = useState([]);
  const [imageFile, setImageFile] = useState({});
  const [accordionList, setAccordion] = useState([]);
  const [isAccordionLoading, setAccordionLoading] = useState(false);
  const [isFileUploaded, setFileUploaded] = useState(false);
  const canvasRef = useRef(null);
  const filesToAccept = ["image/*", "application/dicom", ".dcm", ".dicom"];
  const inputFileRef = useRef(null);
  const cornerstoneRef = useRef(null);

  const handleDroppedImage = useCallback((acceptedFile, rejectedFiles) => {
    console.log("rejected files are :::---??",rejectedFiles);
    console.log("acceptedFile files are :::---??",acceptedFile);
    console.log(acceptedFile);
    if (rejectedFiles.length > 0 || acceptedFile.length <= 0) {
      alert("File type not supported! Use images or dicom files");
      return;
    }
    let currentFile = acceptedFile;
    if (acceptedFile.hasOwnProperty("target")) {
      console.log("has target !!!!");
      currentFile = acceptedFile.target.files;
    }
    setImageFile(currentFile[0]);
    // console.log("imageFile !!!!",currentFile[0]);
    setImage(currentFile);
    setFileUploaded(true);
  }, []);

  const handleImageToServer = () => {
    let file = new FormData();
    file.append("file", imageFile);

    setAccordionLoading(true);
    axiosInstance
      .post("/predict", file, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res) => {
        setAccordionLoading(false);
        setAccordion(res.data.Predictions);
      })
      .catch((err) => {
        setAccordionLoading(false);

        console.log(err);
      });
  };

  const viewPortAction = (func) => () => {
    if (cornerstoneRef.current !== null) {
      const viewport = cornerstone.getViewport(cornerstoneRef.current.element);
      func(viewport);
      cornerstone.setViewport(cornerstoneRef.current.element, viewport);
    }
  };

  const handleInvert = viewPortAction((viewport) => {
    viewport.invert = !viewport.invert;
  });

  const handleHFlip = viewPortAction((viewport) => {
    viewport.hflip = !viewport.hflip;
  });

  const handleVFlip = viewPortAction((viewport) => {
    viewport.vflip = !viewport.vflip;
  });

  const handleRotate = viewPortAction((viewport) => {
    viewport.rotation += 90;
  });

  const options = [
    // {
    //   handleClick: this.handleSize256,
    //   label: "256x256"
    // },
    // {
    //   handleClick: this.handleSize512,
    //   label: "512x512"
    // },
    {
      handleClick: handleInvert,
      label: "Toggle Invert",
      icon: faAdjust
    },
    {
      handleClick: handleHFlip,
      label: "Horizontal Flip",
      icon: faEllipsisH
    },
    {
      handleClick: handleVFlip,
      label: "Vertical Flip",
      icon: faEllipsisV
    },
    {
      handleClick: handleRotate,
      label: "Rotate 90",
      icon: faUndo
    }
  ];

  return (
    <Layout>
      <div className="flex justify-center">
        <h1 className="text-6xl font-bold">
          Diagnosing Abnormalities from Radiology Images{" "}
        </h1>
      </div>

      <ul
        className="flex justify-between border-solid border-t-2 border-b-2 border-blue-600 mb-3 "
        style={{ height: "5rem" }}
      >
        <div className="flex">
          {options.map((ele, idx) => {
            return (
              <li
                key={`${idx}-${ele.label}`}
                onClick={ele.handleClick}
                className="flex items-center justify-center flex-col px-2 py-3 cursor-pointer hover:bg-blue-600 transition-colors duration-200 ease-in-out text-2xl"
              >
                <FontAwesomeIcon
                  style={{ transform: "scaleX(-1)" }}
                  icon={ele.icon}
                />
                <p className="ml-2 text-2xl">{ele.label}</p>
              </li>
            );
          })}
        </div>
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div
          className={`md:col-span-8 p-2 flex items-center justify-center flex-col`}
          style={{
            height: `${isFileUploaded ? "70vh" : "calc(70vh + 5rem + 8px)"}`,
            marginTop: "-4px"
          }}
          ref={canvasRef}
        >
          {isFileUploaded ? (
            <Dropzone
              className="flex justify-center w-full h-full"
              onDrop={handleDroppedImage}
              accept={filesToAccept}
              noClick
            >
              <CornerstoneElement
                stack={{
                  imageIds: imageId,
                  currentImageIdIndex: 0
                }}
                ref={cornerstoneRef}
              />
            </Dropzone>
          ) : (
            <Dropzone
              className="border-dotted border-4 border-gray-600 flex items-center justify-center w-full h-full px-2"
              onDrop={handleDroppedImage}
              accept={filesToAccept}
            >
              <p className="text-2xl">
                Drag 'n' drop a file here, or click to select file
              </p>
            </Dropzone>
          )}
        </div>

        {/* <div
          id="accordion-wrapper"
          className={`md:col-span-4 border-solid border-4 border-gray-600 flex items-center flex-col p-2 overflow-y-auto ${
            accordionList.length < 1 ? "justify-center" : ""
          }`}
          style={{ height: "calc(70vh + 5rem)" }}
        >
          {isAccordionLoading ? (
            <Loader />
          ) : accordionList.length < 1 ? (
            <p className="text-2xl">No Data</p>
          ) : (
            accordionList.map((ele, idx) => {
              return (
                <Accordion
                  key={`${idx}-${ele.name}`}
                  idx={idx}
                  name={ele.name}
                  value={ele.value}
                  url={ele.url}
                />
              );
            })
          )}
        </div> */}
      </div>

      <ul className="flex justify-start">
        <li>
          <input
            className="text-2xl mt-6"
            type="file"
            accept={filesToAccept.join(",")}
            onChange={() => {
              handleDroppedImage(inputFileRef.current.files, []);
            }}
            ref={inputFileRef}
          />
        </li>

        <li
          className="flex items-center justify-center flex-col px-2 py-3 cursor-pointer hover:bg-blue-600 transition-colors duration-200 ease-in-out bg-blue-500"
          onClick={() => handleImageToServer()}
          style={{ minWidth: "8rem" }}
        >
          <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
          <p className="ml-2 text-2xl">Predict</p>
        </li>
      </ul>
    </Layout>
  );
};

export default HandlingImage;
