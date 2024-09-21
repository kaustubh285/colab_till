import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OrderList from '../components/OrderList';
import './Menu.css';
import Popover from '../components/Popover';
import Modals from '../components/Modals';
import { finishOrder, getData } from '../helper/menuHelper';
import CheckoutMain from '../components/CheckoutMain';
function Checkout() {
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
            {showExtraActions && (
                <div
                    className={` ease-in absolute top-0 right-0 bottom-0 w-full bg-black  py-4  z-40 delay-1000 transition-opacity ${
                        showExtraActions ? 'opacity-25' : 'opacity-0'
                    }`}
                ></div>
            )}

            <Modals
                tableModalOpen={tableModalOpen}
                orderAllergy={orderAllergy}
                setOrderAllergy={setOrderAllergy}
                setAllergiesModalOpen={setAllergiesModalOpen}
                allergiesModalOpen={allergiesModalOpen}
                setTableNum={setTableNum}
                setTableModalOpen={setTableModalOpen}
            />

            <div className=" bg-slate-900 flex-1 flex flex-col-reverse md:flex-row overflow-scroll ">
                {/* top */}

                <div className=" bg-slate-50 w-full min-h-16 md:h-full md:w-3/12 hidden md:block max-h-full overflow-scroll relative">
                    {/* Receipt */}
                    <OrderList
                        orderAllergy={orderAllergy}
                        groupedOrder={groupedOrder}
                        setGroupedOrder={setGroupedOrder}
                        subtotal={subtotal}
                        discount={discount}
                        total={total}
                    />
                </div>

                <div className=" flex-1 flex flex-row-reverse">
                    {/* right */}

                    <div className=" w-1/6 border-b border-white grid grid-cols-1 items-stretch gap-3 justify-between text-white px-5 py-4">
                        <div
                            className=" text-xl"
                            onClick={() => {
                                setUserDets({});
                                navigate('/');
                            }}
                        >
                            Logged in as : {userDets.name}
                        </div>
                        <button
                            onClick={() => setShowExtraActions((curr) => !curr)}
                            className="text-xl border p-3 cursor-pointer disabled:opacity-75"
                            disabled={showExtraActions}
                        >
                            Menu
                        </button>
                        <div
                            className=" flex items-center justify-center text-xl border p-3 cursor-pointer"
                            onClick={() => setTableModalOpen(true)}
                        >
                            <p>
                                Table number:
                                <span> {tableNum}</span>
                            </p>
                        </div>

                        <div
                            className=" flex items-center justify-center  text-xl border p-3"
                            onClick={() => setAllergiesModalOpen(true)}
                        >
                            Allergies
                        </div>
                        <div className=" flex items-center justify-center  text-xl border p-3">
                            Some option
                        </div>

                        <div
                            className=" flex items-center justify-center  text-white  bg-teal-400  p-3 active:shadow-none cursor-pointer text-xl"
                            onClick={() => {
                                if (
                                    location.pathname !== '/menu/' &&
                                    location.pathname !== '/menu'
                                )
                                    navigate(-1, {
                                        state: {
                                            orderId: orderId,
                                            tableNum: tableNum,
                                        },
                                    });
                            }}
                        >
                            Back
                        </div>
                    </div>
                    <div
                        className={`relative flex-1 md:flex md:flex-wrap items-center justify-around content-center grid ${
                            menu.length >= 3 ? ' grid-cols-3 ' : ' grid-cols-2 '
                        } menu-content h-full overflow-scroll`}
                    >
                        {/* body */}

                        {showExtraActions && (
                            <>
                                <Popover
                                    showExtraActions={showExtraActions}
                                    setShowExtraActions={setShowExtraActions}
                                />
                            </>
                        )}
                        <CheckoutMain
                            tableNum={tableNum}
                            cartItems={groupedOrder}
                            updateOrderList={updateOrderList}
                        />
                    </div>
                </div>
            </div>

            <div className=" bg-white md:h-max h-40 flex items-center p-1">
                {/* bottom */}
                <div className=" flex-1">
                    <div
                        className=" px-8 py-3 text-white rounded-md bg-red-400 h-max shadow-md active:shadow-none cursor-pointer w-52 text-center  text-3xl"
                        onClick={() => {
                            if (window.confirm('confirm')) {
                                setGroupedOrder([]);
                                localStorage.removeItem('grouped_order');
                            }
                        }}
                    >
                        Clear order
                    </div>
                </div>
                <div className=" flex items-center space-x-3">
                    <div
                        className=" px-8 py-3 text-white rounded-md bg-teal-400 h-max shadow-md active:shadow-none cursor-pointer text-3xl"
                        onClick={() => {
                            navigate(`/menu`, {
                                state: { orderId: orderId, tableNum: tableNum },
                            });
                        }}
                    >
                        Home
                    </div>

                    <div
                        className=" px-8 py-3 text-white rounded-md bg-blue-400 h-max shadow-md active:shadow-none cursor-pointer text-3xl"
                        onClick={() =>
                            finishOrder(
                                groupedOrder,
                                orderAllergy,
                                tableNum,
                                paymentMethod,
                                total,
                                orderId,
                            )
                        }
                    >
                        Order Now
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
