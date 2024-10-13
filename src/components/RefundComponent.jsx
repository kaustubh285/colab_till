import React, { useState } from 'react';
import axios from 'axios';

const RefundComponent = () => {
    const [inputValue, setInputValue] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refundAmounts, setRefundAmounts] = useState({});
    const [refundReasons, setRefundReasons] = useState({});

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `http://localhost:8000/order/check-order-refund/?filter=${encodeURIComponent(inputValue)}`,
            );
            setOrders(
                Array.isArray(response.data) ? response.data : [response.data],
            );
        } catch (err) {
            setError('Failed to fetch orders. Please try again.');
            setOrders([]);
        }
        setLoading(false);
    };

    const formatItems = (contents) => {
        return contents
            .map((item) => `${item.item_name} (x${item.count})`)
            .join(', ');
    };

    const handleRefundAmountChange = (orderId, amount) => {
        const order = orders.find((o) => o.order_id === orderId);
        if (order) {
            const numAmount = parseFloat(amount);
            if (
                !isNaN(numAmount) &&
                numAmount >= 0 &&
                numAmount <= order.total
            ) {
                setRefundAmounts((prev) => ({ ...prev, [orderId]: amount }));
            } else if (numAmount > order.total) {
                setRefundAmounts((prev) => ({
                    ...prev,
                    [orderId]: order.total.toFixed(2),
                }));
            }
        }
    };

    const handleRefundReasonChange = (orderId, reason) => {
        setRefundReasons((prev) => ({ ...prev, [orderId]: reason }));
    };

    const handleRefundSubmit = async (orderId) => {
        const refundAmount = parseFloat(refundAmounts[orderId]);
        const order = orders.find((o) => o.order_id === orderId);

        if (
            !refundAmount ||
            isNaN(refundAmount) ||
            refundAmount <= 0 ||
            refundAmount > order.total
        ) {
            console.error('Invalid refund amount');
            return;
        }

        if (!refundReasons[orderId]) {
            console.error('Please select a refund reason');
            return;
        }

        console.log(`Submitting refund for order ${orderId}`);
        console.log(`Refund amount: ${refundAmount}`);
        console.log(`Refund reason: ${refundReasons[orderId]}`);
        // You would typically make an API call here to process the refund

        let refund = {
            order_id: orderId,
            refund_amount: refundAmount,
            refund_reason: refundReasons[orderId],
        };

        try {
            const response = await axios.put(
                'http://localhost:8000/order/update-order-refund/',
                JSON.stringify(refund),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (response.status === 200) {
                console.log('Refund submitted successfully');
                // Do something on success, e.g., update UI or state
                // For example, you could update the order status in the orders state:
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.order_id === orderId
                            ? { ...order, order_status: 'Refunded' }
                            : order,
                    ),
                );
                // Clear refund inputs
                setRefundAmounts((prev) => ({ ...prev, [orderId]: '' }));
                setRefundReasons((prev) => ({ ...prev, [orderId]: '' }));
            } else {
                console.error('Refund submission failed');
                // Handle non-200 status codes
            }
        } catch (err) {
            setError('Failed to fetch orders. Please try again.');
            setOrders([]);
        }
    };

    return (
        <div className="container-fluid mx-auto p-6 flex flex-col items-center">
            <h1 className="text-white">Refund Section</h1>
            <div class="w-full max-w-lg mb-8 flex">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter order ID or table number..."
                />
                <button
                    onClick={handleSubmit}
                    className="px-6 h-10 relative top-4 bg-blue-500 text-white font-bold rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                >
                    Search
                </button>
            </div>

            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {orders.length > 0 && (
                <div className="w-full h-80 bg-white shadow-md rounded-lg scrollbar-hide overflow-scroll">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                                    Order ID
                                </th>
                                <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Table No
                                </th>
                                <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Method
                                </th>
                                <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Status
                                </th>
                                <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Refund amount
                                </th>
                                <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Refund Reason
                                </th>
                                <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {order.order_id}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {order.table_no}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {new Date(order.time).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4 whitespace-normal">
                                        {' '}
                                        {/* Changed from whitespace-nowrap to whitespace-normal */}
                                        {formatItems(order.contents)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        ${order.total.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {order.payment_method}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {order.order_status}
                                    </td>
                                    <td className="px-6 whitespace-nowrap">
                                        <input
                                            type="number"
                                            value={
                                                refundAmounts[order.order_id] ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                handleRefundAmountChange(
                                                    order.order_id,
                                                    e.target.value,
                                                )
                                            }
                                            className={`w-16 border rounded px-2 py-1 ${
                                                parseFloat(
                                                    refundAmounts[
                                                        order.order_id
                                                    ],
                                                ) > order.total
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            }`}
                                            placeholder="0"
                                            max={order.total}
                                            step="0.01"
                                            min=""
                                        />
                                        {parseFloat(
                                            refundAmounts[order.order_id],
                                        ) > order.total && (
                                            <p className="text-red-500 text-xs mt-1">
                                                Exceeds total
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={
                                                refundReasons[order.order_id] ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                handleRefundReasonChange(
                                                    order.order_id,
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border border-gray-300 rounded px-2 py-1"
                                            title={
                                                refundReasons[order.order_id] ||
                                                'Select reason'
                                            }
                                        >
                                            <option value="">
                                                Select reason
                                            </option>
                                            <option value="Wrong order">
                                                Wrong order
                                            </option>
                                            <option value="Quality issue">
                                                Quality issue
                                            </option>
                                            <option value="Late delivery">
                                                Late delivery
                                            </option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() =>
                                                handleRefundSubmit(
                                                    order.order_id,
                                                )
                                            }
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Refund
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RefundComponent;
