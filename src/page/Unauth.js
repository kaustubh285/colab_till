import { useState, useEffect } from "react";

import { channels } from "../shared/constants";
import Keypad from "../components/Keypad";

// const { ipcRenderer } = window.require("electron");
function Unauth() {
  const [input, setInput] = useState("");
  const [product, setProduct] = useState("");
  const [data, setData] = useState(null);

  const verifyCode = () => {
    if (input === "1234") return true;
  };

  const handleClockEvent = () => {
    if (verifyCode()) alert(`${input} user clocked-in`);
    else {
      alert("no such user!");
      setInput("");
    }
    // Send the event to get the data
    // ipcRenderer.send(channels.GET_DATA, { product });
  };

  const handleLogin = () => {
    if (verifyCode()) alert(`${input} user logged-in`);
    else {
      alert("no such user!");
      setInput("");
    }
  };

  return (
    <div className='h-screen w-screen'>
      <div className='flex flex-col space-y-3 items-center justify-center h-full w-full bg-blue-100'>
        <p className=' text-2xl font-semibold'>{`{Cafe Name}`}</p>
        <p className=' text-xl'>{`Login to access till or clock-in`}</p>
        <Keypad
          input={input}
          setInput={setInput}
          handleLogin={handleLogin}
          handleClockEvent={handleClockEvent}
        />
      </div>
    </div>
  );
}
export default Unauth;
