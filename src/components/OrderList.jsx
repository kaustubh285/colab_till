import React, { useEffect, useState } from "react";

const OrderList = ({ currOrder }) => {
  const [groupedOrder, setGroupedOrder] = useState([]);

  useEffect(() => {
    // Group by item name
    const grouped = Object.groupBy(currOrder, ({ item_name }) => item_name);
    setGroupedOrder(grouped);
  }, [currOrder]);
  // if (currOrder.length > 3)

  //    Object.groupBy(currOrder, ({ item_name }) => item_name)

  console.log(currOrder);
  return (
    <div className=' h-full  p-2 flex flex-col divide-y-2'>
      <p className='w-full text-xl'>Order till now</p>
      <div className=' flex-1 space-y-3'>
        {Object.keys(groupedOrder).map((item_name) => {
          const items = groupedOrder[item_name];
          const totalPrice = items.reduce(
            (sum, item) => sum + item.item_price_eat_in,
            0
          );
          const count = groupedOrder[item_name].length;
          return (
            <div className=' flex' key={item_name}>
              <p className=' min-w-9'> {`${count} x  `} </p>
              <p className=' flex-1'> {item_name}</p>
              <p className=' flex-1 max-w-12 overflow-hidden'>
                {" "}
                {"........................."}
              </p>
              <p className=' ml-2'>{totalPrice.toFixed(2)}</p>{" "}
              {/* Display total price */}
            </div>
          );
        })}
      </div>
      <div>
        <div className=' divide-red-300 flex w-full justify-between items-center'>
          <p>final</p>
          <p>
            {currOrder.length === 0
              ? 0.0
              : currOrder
                  .map((item) => item.item_price_eat_in)
                  .reduce((prev, next) => prev + next)
                  .toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
