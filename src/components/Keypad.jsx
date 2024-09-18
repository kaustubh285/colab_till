import React, { useState } from "react";

const Keypad = ({
  input,
  setInput,
  handleLogin,
  handleClockEvent,
  isCheckout,
}) => {
  const keypadValues = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "clear",
    "0",
    "<",
  ];

  const handleClick = (val) => {
    if (input + val === "") {
      setInput("");
      return;
    }
    // Guard clause wont let the code go ahead without this requirement
    // if (Number(input + val) > 10000 || Number(input + val) < 0) return;

    if (keypadValues.includes(val)) {
      if (val === "clear") {
        setInput("");
        return;
      }
      if (val === "<") {
        setInput((current) => {
          return current.slice(0, current.length - 1);
        });
        return;
      }
      setInput((current) => {
        return current + val;
      });
    }
  };

  const handleInputChange = (val) => {
    // When val is an event object from onChange
    if (val && val.target) {
      const newValue = val.target.value;
      if (
        newValue === "" ||
        (Number(newValue) >= 0 && Number(newValue) < 10000)
      ) {
        setInput(newValue);
      }
    } else {
      if (Number(input + val) > 10000 || Number(input + val) < 0) return;
      // When val is a string from keypadValues
      if (val === "clear") {
        setInput("");
      } else if (val === "<") {
        setInput((current) => current.slice(0, current.length - 1));
      } else {
        setInput((current) => current + val);
      }
    }
  };
  if (isCheckout) {
    return (
      <div className="w-full">
        <div className="flex flex-col space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            {keypadValues.map((value) => (
              <div
                key={value}
                className={
                  "px-3 py-2 shadow-md text-black cursor-pointer rounded-md active:shadow-none " +
                  (value === "<"
                    ? " bg-red-300 "
                    : value === "clear"
                      ? " bg-blue-300 "
                      : " bg-white")
                }
                onClick={() => handleInputChange(value)}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-8/12 md:6/12 lg:w-3/12">
        <div className="flex flex-col space-y-5">
          <input
            placeholder="Enter emp till code here to login or clock-in..."
            className="text-black bg-white h-20 text-center"
            value={input}
            type="number"
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-3 gap-3 text-center">
            {keypadValues.map((value) => (
              <div
                key={value}
                className={
                  "px-3 py-2 shadow-md text-black cursor-pointer rounded-md active:shadow-none " +
                  (value === "<"
                    ? " bg-red-300 "
                    : value === "clear"
                      ? " bg-blue-300 "
                      : " bg-white")
                }
                onClick={() => handleInputChange(value)}
              >
                {value}
              </div>
            ))}
          </div>
          <button
            className="px-3 py-2 bg-green-400 shadow-md text-black cursor-pointer rounded-md active:shadow-none"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="px-3 py-2 bg-amber-500 shadow-md text-black cursor-pointer rounded-md active:shadow-none"
            onClick={handleClockEvent}
          >
            Clock-in / clock-out
          </button>
        </div>
      </div>
    );
  }
};

export default Keypad;
