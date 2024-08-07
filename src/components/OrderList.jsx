import React, { useEffect, useState } from "react";

const OrderList = ({ currentOrder }) => {
  return (
    <div className='bg-slate-50 min-h-32 md:w-2/12 p-2'>
      <p className='w-full text-center text-xl'>Order till now</p>
      <p className=' text-center'>-----------------------------</p>
      {currentOrder.map((item) => (
        <div className=' flex'>
          <p className=' flex-1'>{item.item_name}</p>
          <p>{item.item_price_eat_in}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
