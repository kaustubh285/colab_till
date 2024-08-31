import React, { useEffect, useState } from "react";
import {
  SwipeableList,
  SwipeableListItem,
} from "@sandstreamdev/react-swipeable-list";
import "@sandstreamdev/react-swipeable-list/dist/styles.css";

// Custom function to group items by a key
// const groupBy = (array, key) => {
//   return array.reduce((result, currentValue) => {
//     (result[currentValue[key]] = result[currentValue[key]] || []).push(
//       currentValue
//     );
//     return result;
//   }, {});
// };

const OrderList = ({
  groupedOrder,
  setGroupedOrder,
  handleAddMessage,
  orderAllergy,
}) => {
  // const [groupedOrder, setGroupedOrder] = useState({});

  // useEffect(() => {
  //   // Use the custom groupBy function
  //   const grouped = groupBy(currOrder, "item_name");
  //   setGroupedOrder(grouped);
  // }, [currOrder]);

  const handleDelete = (item_name) => {
    let newOrder = groupedOrder.filter((item) => item.item_name !== item_name);
    setGroupedOrder(newOrder);
    localStorage.setItem("grouped_order", JSON.stringify(newOrder));
  };

  const swipeLeftDataSimple = (item_name) => ({
    content: (
      <div className=' bg-red-500 text-end w-full text-white font-semibold px-2 py-3'>
        <span>Delete</span>
      </div>
    ),
    action: () => handleDelete(item_name),
  });
  return (
    <div className='h-full p-2 flex flex-col divide-y-2 overflow-scroll'>
      <p className='w-full text-xl'>Order till now</p>
      {/* <p className=' bg-red-100'>
        Allergies:<span className=' pl-2'>{orderAllergy.toString()}</span>
      </p> */}
      <div className='flex-1 space-y-3 pb-10'>
        <SwipeableList className='flex flex-col-reverse'>
          {groupedOrder.map((item) => {
            return (
              <SwipeableListItem
                key={item.item_name}
                swipeLeft={swipeLeftDataSimple(item.item_name)}>
                <div className=' w-full py-3 border-dashed border-b flex flex-col'>
                  <div className='flex  w-full'>
                    <p className='min-w-9'>{`${item.count} x  `}</p>
                    <p className='flex-1'>{item.item_name}</p>
                    <p className='flex-1 max-w-12 overflow-hidden'>
                      {" "}
                      {"........................."}
                    </p>
                    <p className='ml-2'>
                      {(item.count * item.item_price_eat_in).toFixed(2)}
                    </p>
                  </div>

                  <input
                    className=' w-full border rounded-lg border-slate-400 text-xs'
                    type='text'
                    placeholder='notes'
                    value={item.message}
                    onChange={(e) => handleAddMessage(item, e.target.value)}
                  />
                </div>
              </SwipeableListItem>
            );
          })}
        </SwipeableList>
      </div>

      {orderAllergy.length > 0 && (
        <div className='divide-red-300 flex justify-between items-center p-2 absolute bottom-10 left-0 right-0 bg-white'>
          <p className=' bg-red-100'>
            Allergies:<span className=' pl-2'>{orderAllergy.toString()}</span>
          </p>
        </div>
      )}
      <div className='divide-red-300 flex justify-between items-center p-2 absolute bottom-0 left-0 right-0 bg-white'>
        <p>Final</p>
        <p>
          {groupedOrder.length === 0
            ? 0.0
            : groupedOrder
                .map((item) => item.item_price_eat_in * item.count)
                .reduce((prev, next) => prev + next, 0)
                .toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderList;
