import React, { useState } from 'react';
import axios from 'axios';

const TableOrderSearch = () => {
    const [inputValue, setInputValue] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `http://localhost:8000/order/check-table-order/?filter=${encodeURIComponent(inputValue)}`,
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

    return (
        <div className="container mx-auto p-6 flex flex-col items-center">
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Table No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {order.order_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {order.table_no}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(order.time).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal">
                                        {' '}
                                        {/* Changed from whitespace-nowrap to whitespace-normal */}
                                        {formatItems(order.contents)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${order.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {order.payment_method}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {order.order_status}
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

export default TableOrderSearch;
