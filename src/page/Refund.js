import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Menu.css';
import TableOrderSearch from '../components/TableOrderSearch';
import RefundComponent from '../components/RefundComponent';
function Refund() {
    const navigate = useNavigate();
    const location = useLocation();

    const [groupedOrder, setGroupedOrder] = useState([]);
    const [userDets, setUserDets] = useState({});
    const [tableNum, setTableNum] = useState(location.state?.tableNum || 0);

    const orderId = location.state?.orderId;

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
                    <RefundComponent></RefundComponent>
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

export default Refund;
