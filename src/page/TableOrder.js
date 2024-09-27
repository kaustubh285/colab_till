import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OrderList from '../components/OrderList';
import './Menu.css';
import Popover from '../components/Popover';
import Modals from '../components/Modals';
import { finishOrder, getData } from '../helper/menuHelper';
import CheckoutMain from '../components/CheckoutMain';
import TableOrderSearch from '../components/TableOrderSearch';
function TableOrder() {
    const navigate = useNavigate();
    const location = useLocation();

    const [menu, setMenu] = useState([]);
    const [groupedOrder, setGroupedOrder] = useState([]);
    const [userDets, setUserDets] = useState({});
    const [tableNum, setTableNum] = useState(location.state?.tableNum || 0);

    const [tableModalOpen, setTableModalOpen] = useState(false);
    const [allergiesModalOpen, setAllergiesModalOpen] = useState(false);
    const [orderAllergy, setOrderAllergy] = useState([]);

    const [showExtraActions, setShowExtraActions] = useState(false);

    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const orderId = location.state?.orderId;

    const updateOrderList = (newSubtotal, newDiscount, newTotal, payMethod) => {
        setSubtotal(newSubtotal);
        setDiscount(newDiscount);
        setTotal(newTotal);
        setPaymentMethod(payMethod);
    };

    useEffect(() => {
        const user_dets = JSON.parse(localStorage.getItem('user_dets'));

        setUserDets(user_dets);
        if (!user_dets) {
            // setUserDets({ id: 2, name: "Kaustubh", code: "696" });
            navigate('/');
        }
    }, [location.pathname]);

    useEffect(() => {
        setGroupedOrder(
            JSON.parse(localStorage.getItem('grouped_order')) || [],
        );
    }, []);
    return (
        <div className="h-screen w-screen flex flex-col overflow-scroll bg-slate-900 relative">
            <div className="flex-1 flex justify-center items-center">
                <div className="w-full">
                    <TableOrderSearch></TableOrderSearch>
                </div>
            </div>

            <div className="bg-white md:h-max h-40 flex items-center p-1">
                {/* bottom */}
                <div className="flex items-center space-x-3">
                    <div
                        className="px-8 py-3 text-white rounded-md bg-teal-400 h-max shadow-md active:shadow-none cursor-pointer text-3xl"
                        onClick={() => {
                            navigate(`/menu`, {
                                state: { orderId: orderId, tableNum: tableNum },
                            });
                        }}
                    >
                        Home
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableOrder;
