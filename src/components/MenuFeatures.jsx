import React from "react";
import { Link } from "react-router-dom";

const MenuFeatures = ({ navigate }) => {
  return (
    <div className='bg-amber-100 w-full h-full grid grid-cols-6 gap-x-4 p-2'>
      <div className=' rounded-lg w-full aspect-square bg-slate-400 flex justify-center items-center text-center hover:bg-slate-300 hover:cursor-pointer shadow-lg active:shadow-none'>
        Home
      </div>
      <div className=' rounded-lg w-full aspect-square bg-slate-400 flex justify-center items-center text-center hover:bg-slate-300 hover:cursor-pointer shadow-lg active:shadow-none'>
        Set Table Number
      </div>
      {/* <div className='bg-orange-200 min-h-32 flex justify-around'> */}{" "}
      <Link
        to='/menu/drinks'
        className='rounded-lg w-full aspect-square bg-slate-400 flex justify-center items-center text-center hover:bg-slate-300 hover:cursor-pointer shadow-lg active:shadow-none'>
        Drinks
      </Link>
      <Link
        to='/menu/food'
        className='rounded-lg w-full aspect-square bg-slate-400 flex justify-center items-center text-center hover:bg-slate-300 hover:cursor-pointer shadow-lg active:shadow-none'>
        Food
      </Link>
      <div
        className='rounded-lg w-full aspect-square bg-slate-400 flex justify-center items-center text-center hover:bg-slate-300 hover:cursor-pointer shadow-lg active:shadow-none'
        onClick={() => navigate(-1)}>
        Back
      </div>
      {/* </div> */}
    </div>
  );
};

export default MenuFeatures;
