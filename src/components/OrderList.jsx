import React, { useEffect, useState } from 'react';
import {
    SwipeableList,
    SwipeableListItem,
} from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import {
    addToOrder,
    handleAddMessage,
    handleDelete,
    removeOnceFromOrder,
} from '../helper/menuHelper';

const OrderList = ({
    groupedOrder,
    setGroupedOrder,
    orderAllergy,
    subtotal,
    discount,
    total,
    menuScreen,
}) => {
    const swipeLeftDataSimple = (item_name) => ({
        content: (
            <div className=" bg-red-500 text-end w-full text-white font-semibold px-2 py-3">
                <span>Delete</span>
            </div>
        ),
        action: () => handleDelete(item_name, groupedOrder, setGroupedOrder),
    });
    return (
        <div className="h-full py-2 flex flex-col divide-y-2 overflow-scroll">
            <p className=" px-2w-full text-xl">Order till now</p>
            <div className="flex-1 space-y-3 pb-10">
                <SwipeableList className="flex flex-col-reverse">
                    {groupedOrder.map((item) => {
                        return (
                            <SwipeableListItem
                                key={item.item_name}
                                swipeLeft={swipeLeftDataSimple(item.item_name)}
                            >
                                <div className="w-full flex items-stretch justify-between">
                                    <div
                                        className=" flex flex-col  justify-around items-center cursor-pointer"
                                        onClick={() =>
                                            removeOnceFromOrder(
                                                item,
                                                groupedOrder,
                                                setGroupedOrder,
                                            )
                                        }
                                    >
                                        <div className="  px-3 py-2 text-3xl">
                                            -
                                        </div>
                                    </div>
                                    <div className=" bg-slate-200 flex-1 py-3 border-dashed border-b flex flex-col px-2 border-r-2 border-l-2">
                                        <div className="flex  w-full">
                                            <p className="min-w-9">{`${item.count} x  `}</p>
                                            <p className="flex-1">
                                                {item.item_name}
                                            </p>
                                            <p className="flex-1 max-w-12 overflow-hidden">
                                                {' '}
                                                {'.........................'}
                                            </p>
                                            <p className="ml-2">
                                                {(
                                                    item.count *
                                                    item.item_price_eat_in
                                                ).toFixed(2)}
                                            </p>
                                        </div>

                                        <input
                                            className=" w-full border rounded-lg border-slate-400 text-xs"
                                            type="text"
                                            placeholder="notes"
                                            value={item.message}
                                            onChange={(e) =>
                                                handleAddMessage(
                                                    item,
                                                    e.target.value,
                                                    groupedOrder,
                                                    setGroupedOrder,
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className=" flex flex-col  justify-around items-center cursor-pointer"
                                        onClick={() =>
                                            addToOrder(
                                                item,
                                                groupedOrder,
                                                setGroupedOrder,
                                            )
                                        }
                                    >
                                        <div className=" px-3 py-2 text-2xl ">
                                            +
                                        </div>
                                    </div>
                                </div>
                            </SwipeableListItem>
                        );
                    })}

                    {groupedOrder.length === 0 ? (
                        <div className=" h-full w-full bg-slate-50 flex items-center justify-center">
                            <h1 className=" text-slate-500">
                                Order list empty...
                            </h1>
                        </div>
                    ) : (
                        <></>
                    )}
                </SwipeableList>
            </div>

            {orderAllergy.length > 0 && (
                <div className="divide-red-300 flex justify-between items-center p-2 absolute bottom-10 left-0 right-0 bg-white">
                    <p className=" bg-red-100">
                        Allergies:
                        <span className=" pl-2">{orderAllergy.toString()}</span>
                    </p>
                </div>
            )}
            <div
                className="divide-red-300 flex justify-between items-center p-2 absolute bottom-0 left-0 right-0 bg-white"
                style={
                    menuScreen
                        ? {}
                        : {
                              flexDirection: 'column',
                              alignItems: 'stretch',
                          }
                }
            >
                {menuScreen ? (
                    <>
                        <p>Final</p>
                        <p>
                            {groupedOrder.length === 0
                                ? '0.00'
                                : (
                                      groupedOrder.reduce(
                                          (prev, item) =>
                                              prev +
                                              item.item_price_eat_in *
                                                  item.count,
                                          0,
                                      ) || 0
                                  ).toFixed(2)}
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-md flex border-b border-black text-xl py-2">
                            <span className="flex-1">Subtotal:</span>{' '}
                            <span>${(subtotal || 0).toFixed(2)}</span>
                        </p>

                        <p
                            className="text-md flex border-b border-black text-xl py-2"
                            style={{
                                borderColor: 'black',
                            }}
                        >
                            <span className="flex-1">Discount:</span>{' '}
                            <span>${(discount || 0).toFixed(2)}</span>
                        </p>

                        <p
                            className="text-md font-bold flex border-b border-black text-xl py-2"
                            style={{
                                borderColor: 'black',
                            }}
                        >
                            <span className="flex-1">Total:</span>
                            <span>${(total || 0).toFixed(2)}</span>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderList;
