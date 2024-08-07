import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [userDets, setUserDets] = useState({});

  useEffect(() => {
    const user_dets = JSON.parse(localStorage.getItem("user_dets"));
    console.log(user_dets);
    setUserDets(user_dets);
    if (!user_dets) {
      navigate("/");
    }
  }, []);

  return (
    <div className='h-screen w-screen'>
      <div className='flex flex-col space-y-3 items-center justify-center h-full w-full bg-blue-100'>
        <p className=' text-2xl'>HOME</p>
        <p className=' text-xl'>Logged in as {userDets?.name}</p>
        <button
          className=' bg-red-200 px-4 py-2 rounded-lg shadow-md active:shadow-none'
          onClick={() => {
            localStorage.removeItem("user_dets");
            navigate("/");
          }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
