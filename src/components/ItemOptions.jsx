import React from "react";

const ItemOptions = ({ item }) => {
  return (
    <div className=' flex items-center justify-around text-white w-full'>
      {Object.keys(item.options).map((typ) => (
        <div className=' flex flex-col items-center justify-around h-full space-y-6 flex-1'>
          <p className=' text-2xl'>{typ}</p>
          {item.options[typ].map((typ_varieties) => (
            <div className='text-lg md:text-xl w-2/12 max-w-56 text-center justify-center items-center flex aspect-square active:shadow-none cursor-pointer bg-blue-200 px-4 py-2 rounded-lg shadow-sm m-2 relative flex-col space-y-2 shadow-slate-100 text-slate-800'>
              {typ_varieties}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ItemOptions;
