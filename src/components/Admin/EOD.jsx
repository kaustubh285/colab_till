import React, { useEffect, useState } from 'react';

const EOD = () => {
    const [dayOrders, setDayOrders] = useState([]);
    const [showOrdersModal, setShowOrdersModal] = useState({});
    const typesOfReports = ['EOD: All', 'EOD: Employees', 'EOD: Orders'];

    const getEmpData = async () => {
        const date = new Date();
        var yesterday = new Date(Date.now() - 86400000);
        const empData = await fetch(
            `http://localhost:8000/employee/get-clock-for-dates/?start_date=${yesterday.getMonth()}-${yesterday.getDate()}-${yesterday.getFullYear()}&end_date=${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`,
        ).then((res) => res.json());

        return empData;
    };

    const getOrdersData = async () => {
        const ordersData = await fetch(
            `http://localhost:8000/order/generate-report/?report_type=EOD:all`,
        ).then((res) => res.json());

        return ordersData;
    };

    const triggerReport = async (reportType) => {
        window.alert(`Triggered report for ${reportType}`);
        const empData = await getEmpData();
        const ordersData = await getOrdersData();
        const reportData = { empData, ordersData };
        alert('Printing report');
        // This is where the communication will be held! but we need api calls for that.
    };

    const getOrdersOnLoad = async () => {
        const ordersData = await getOrdersData();
        console.log(ordersData);
        setDayOrders(ordersData);
    };

    useEffect(() => {
        getOrdersOnLoad();
    }, []);
    return (
        <div class="flex-1 bg-white p-5 h-full w-full overflow-x-hidden">
            {Object.keys(showOrdersModal).length > 0 && (
                <div className=" w-screen h-screen absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div
                        className=" bg-white px-9 py-5 overflow-auto relative"
                        style={{
                            maxHeight: '80%',
                        }}
                    >
                        <div className=" flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Order Summary - {showOrdersModal.order_id}
                            </h2>
                            <p
                                className=" text-2xl font-semibold text-gray-800 mb-4 cursor-pointer hover:shadow-md p-2 rounded"
                                onClick={() => setShowOrdersModal({})}
                            >
                                X
                            </p>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-gray-600">
                                <span className="font-bold">Table No:</span>{' '}
                                {showOrdersModal.table_no === 9999
                                    ? 'Takeaway'
                                    : showOrdersModal.table_no}
                            </p>
                            <p
                                className={`text-sm ${showOrdersModal.paid ? 'text-green-500' : 'text-red-500'}`}
                            >
                                {showOrdersModal.paid ? 'Paid' : 'Unpaid'}
                            </p>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-800">
                                Items:
                            </h3>
                            <div className=" flex flex-wrap">
                                {showOrdersModal.contents.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-100 p-3 my-2 rounded-md mx-2"
                                    >
                                        <h4 className="font-semibold text-gray-700">
                                            {item.item_name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {item.item_description}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Contents: {item.item_contents}
                                        </p>
                                        <div className="flex justify-between mt-1">
                                            {showOrdersModal.table_no !==
                                            9999 ? (
                                                <p className="text-gray-600">
                                                    Eat-in Price: $
                                                    {item.item_price_eat_in}
                                                </p>
                                            ) : (
                                                <p className="text-gray-600">
                                                    Takeaway Price: $
                                                    {item.item_price_takeaway}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-2">
                            <p className="text-gray-600">
                                <span className="font-bold">Total:</span> $
                                {showOrdersModal.total.toFixed(2)}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-bold">
                                    Payment Method:
                                </span>{' '}
                                {showOrdersModal.payment_method}
                            </p>
                        </div>
                        <p className="text-gray-500 text-sm">
                            <span className="font-bold">Time:</span>{' '}
                            {new Date(showOrdersModal.time).toLocaleString()}
                        </p>
                        <p
                            className=" w-full bg-red-300  p-3 text-center mt-3 hover:bg-red-400 hover:shadow-md cursor-pointer"
                            onClick={() => setShowOrdersModal({})}
                        >
                            Close
                        </p>
                    </div>
                </div>
            )}
            <div class="header flex flex-wrap items-center justify-between mb-8">
                <p class="text-3xl font-semibold">EOD: End of Day</p>
            </div>

            <p className=" text-2xl  font-semibold">Print reports </p>
            <hr className="pb-3"></hr>
            <div className="flex flex-wrap">
                {typesOfReports.map((rType) => (
                    <div
                        className=" px-9 py-8 text-center w-3/12 border rounded-md mx-3 cursor-pointer shadow-lg"
                        onClick={() => triggerReport(rType)}
                    >
                        {rType}
                    </div>
                ))}
            </div>
            <p className=" text-2xl pt-9  font-semibold">Orders of the day</p>
            <hr className="pb-9"></hr>

            <div className="flex flex-wrap w-100">
                {dayOrders &&
                    dayOrders.map((order) => (
                        <div
                            className="px-9 py-8 text-center w-80 mx-2 border rounded-md cursor-pointer shadow-lg flex flex-col space-y-3 my-2"
                            onClick={() => setShowOrdersModal(order)}
                        >
                            <p className="text-xl font-semibold">
                                Order No: {order.order_id}
                            </p>
                            <p className="text-xl">
                                Table No: {order.table_no}
                            </p>
                            <p className="text-xl">Amount {order.total}£</p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default EOD;
