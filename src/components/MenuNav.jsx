import React from "react";

const MenuNav = ({ navigate, userDets }) => {
  return (
    <div className='flex justify-between items-center w-full p-2'>
      <p className='text-2xl'>MENU</p>
      <p className='text-xl'>Logged in as {userDets?.name}</p>
      <button
        className='bg-red-200 px-4 py-2 rounded-lg shadow-md active:shadow-none'
        onClick={() => navigate("/home")}>
        LOGOUT
      </button>
    </div>
  );
};

export default MenuNav;
