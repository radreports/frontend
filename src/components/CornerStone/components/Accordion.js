import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const Accordion = ({ idx, name, value, url }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="accordion-wrapper w-full mb-4">
      <div
        className={`accordion-title text-2xl cursor-pointer rounded-sm border-solid border-2 border-white ${
          isOpen ? "open" : ""
        }`}
        onClick={() => setOpen(!isOpen)}
      >
        <p className="flex justify-between bg-blue-600 py-2 px-4">
          <span>
            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
            <span className="inline-block ml-4">{name}</span>
          </span>
          <span className="inline-block">{`${(value * 100).toFixed(2)}%`}</span>
        </p>
      </div>
      <div
        className={`accordion-item overflow-hidden transition-all duration-300 ease-in-out h-auto`}
        style={{ maxHeight: !isOpen ? 0 : "9999px" }}
      >
        <div className="accordion-content py-2 px-4">
          <img src={url} alt={name} />
        </div>
      </div>
    </div>
  );
};

export default Accordion;
