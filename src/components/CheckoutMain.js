import React, { useState, useEffect } from 'react';
import Keypad from './Keypad';

function CheckoutMain({ tableNum, cartItems, updateOrderList }) {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardType, setCardType] = useState('');
    const [discountType, setDiscountType] = useState('0');
    const [customDiscount, setCustomDiscount] = useState('');
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);
    const [cashInput, setCashInput] = useState('');
    const [changeOrDue, setChangeOrDue] = useState({ amount: 0, type: 'none' });
    const [activeInput, setActiveInput] = useState(null); // 'cash' or 'discount'

    const boxClass =
        'w-full py-8 flex items-center justify-center bg-slate-200 rounded-lg text-black';
    // 'max-w-36 aspect-square flex items-center justify-center bg-slate-200 rounded-lg text-black';
    const handleKeypadInput = (value) => {
        if (activeInput === 'cash') {
            setCashInput(value);
        } else if (activeInput === 'discount') {
            setCustomDiscount(value);
        }
    };

    useEffect(() => {
        calculateTotals();
    }, [cartItems, discountType, customDiscount, paymentMethod]);

    useEffect(() => {
        if (cashInput) {
            const difference = parseFloat(cashInput) - total;
            if (difference >= 0) {
                setChangeOrDue({ amount: difference, type: 'change' });
            } else {
                setChangeOrDue({ amount: Math.abs(difference), type: 'due' });
            }
        } else {
            setChangeOrDue({ amount: 0, type: 'none' });
        }
    }, [paymentMethod, cashInput, total]);

    const calculateTotals = () => {
        const newSubtotal = cartItems.reduce(
            (sum, item) => sum + item.item_price_eat_in * item.count,
            0,
        );
        let discountPercentage = 0;

        switch (discountType) {
            case '5':
                discountPercentage = 0.05;
                break;
            case '10':
                discountPercentage = 0.1;
                break;
            case '15':
                discountPercentage = 0.15;
                break;
            case 'custom':
                discountPercentage = parseFloat(customDiscount) / 100 || 0;
                break;
            default:
                discountPercentage = 0;
        }

        const newDiscount = newSubtotal * discountPercentage;
        const newTotal = newSubtotal - newDiscount;

        setSubtotal(newSubtotal);
        setDiscount(newDiscount);
        setTotal(newTotal);

        console.log('payment Method ', paymentMethod);

        // Update OrderList
        updateOrderList(newSubtotal, newDiscount, newTotal, paymentMethod);
    };

    useEffect(() => {
        if (discountType !== 'custom') {
            setCustomDiscount('');
        }
    }, [discountType]);

    const paymentSubmit = (submissionType) => {
        let tableStr =
            tableNum === 'takeaway' ? 'takeaway' : `table number ${tableNum}`;
        let confirmMsg =
            submissionType === 'later'
                ? `Would you like to place a 'pay-later' order for ${tableStr} with outstanding amount : ${total}$`
                : `Confirm payment of ${total} for ${tableStr}`;
        if (window.confirm(confirmMsg)) {
            switch (submissionType) {
                case 'later':
                    break;
                case 'now':
                    console.log('in now');
                    if (changeOrDue.amount > 0) {
                        alert(
                            `Amount ${changeOrDue.amount.toFixed(2)} due. Payment not confirmed`,
                        );
                    }
                    break;
                default:
                    console.log('in default');
                    break;
            }
        }
    };

    useEffect(() => {
        if (customDiscount > 100) {
            setCustomDiscount('100');
        }
    }, [customDiscount]);

    return (
        <>
            <div className="w-full py-14 px-8 pb-26  h-full">
                <h2 className="text-3xl text-white font-bold mb-4">Checkout</h2>
                <div className=" flex flex-col space-y-5 justify-between h-full ">
                    <div className="top">
                        <div className=" grid grid-cols-6 gap-4 text-white">
                            {/* Card */}
                            <div className=" text-2xl font-semibold flex items-center  col-span-2">
                                Card
                            </div>
                            <div
                                className={`${boxClass} col-span-2`}
                                onClick={() => {
                                    setCashInput('');
                                    setChangeOrDue({ amount: 0, type: 'none' });
                                    setCardType('integrated');
                                }}
                                style={{
                                    backgroundColor:
                                        cardType === 'integrated' && '#42eb6f',
                                }}
                            >
                                Integrated Card
                            </div>
                            <div
                                className={`${boxClass} col-span-2`}
                                onClick={() => {
                                    setCashInput('');
                                    setChangeOrDue({ amount: 0, type: 'none' });
                                    setCardType('non-integrated');
                                }}
                                style={{
                                    backgroundColor:
                                        cardType === 'non-integrated' &&
                                        '#42eb6f',
                                }}
                            >
                                Non-Integrated Card
                            </div>

                            {/* Cash */}

                            <div className=" text-2xl font-semibold flex items-center  col-span-2">
                                Cash
                            </div>
                            <div
                                className={`${boxClass} col-span-2 flex flex-col justify-evenly items-center`}
                                onClick={() => {
                                    setCardType(null);
                                    setActiveInput('cash');
                                }}
                            >
                                <p>Amount paid</p>
                                <input
                                    type="number"
                                    value={cashInput}
                                    onChange={(e) =>
                                        setCashInput(e.target.value)
                                    }
                                    placeholder="Enter cash amount"
                                    className="w-full p-2  bg-slate-200 outline-none text-center"
                                    onFocus={() => {
                                        setCardType(null);
                                        setActiveInput('cash');
                                    }}
                                />
                            </div>
                            <div
                                className={`${boxClass} col-span-2 flex flex-col justify-evenly items-center`}
                            >
                                <p>Amount due</p>

                                <p
                                    className={`mt-2 ${changeOrDue.type === 'none' ? 'text-black' : changeOrDue.type === 'change' ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    {changeOrDue.type === 'change'
                                        ? 'Change due: '
                                        : 'Amount due: '}
                                    ${changeOrDue.amount.toFixed(2)}
                                </p>
                            </div>

                            {/* Discount */}

                            <div className=" text-2xl font-semibold flex items-center  col-span-2">
                                Discount
                            </div>
                            <div
                                className={boxClass}
                                onClick={() => {
                                    discountType !== '5'
                                        ? setDiscountType('5')
                                        : setDiscountType('0');
                                }}
                                style={{
                                    backgroundColor:
                                        discountType === '5' && '#42eb6f',
                                }}
                            >
                                5%
                            </div>
                            <div
                                className={boxClass}
                                onClick={() => {
                                    discountType !== '10'
                                        ? setDiscountType('10')
                                        : setDiscountType('0');
                                }}
                                style={{
                                    backgroundColor:
                                        discountType === '10' && '#42eb6f',
                                }}
                            >
                                10%
                            </div>
                            <div
                                className={boxClass}
                                onClick={() => {
                                    discountType !== '15'
                                        ? setDiscountType('15')
                                        : setDiscountType('0');
                                }}
                                style={{
                                    backgroundColor:
                                        discountType === '15' && '#42eb6f',
                                }}
                            >
                                15%
                            </div>
                            <div
                                className={`${boxClass}`}
                                onClick={() => {
                                    if (discountType === 'custom')
                                        setDiscountType('0');
                                    else {
                                        setDiscountType('custom');
                                        setActiveInput('discount');
                                    }
                                }}
                                style={{
                                    backgroundColor:
                                        discountType === 'custom' && '#42eb6f',
                                }}
                            >
                                <input
                                    type="number"
                                    value={customDiscount}
                                    onChange={(e) => {
                                        e.target.value > 0 &&
                                            setCustomDiscount(e.target.value);
                                    }}
                                    placeholder="Custom"
                                    className=" flex-1 p-2 pr-0 m-0 bg-transparent  outline-none text-end"
                                    style={{
                                        maxWidth: '50%',
                                    }}
                                    onFocus={() => setActiveInput('discount')}
                                />
                                {discountType === 'custom' &&
                                    customDiscount && (
                                        <div className=" flex-1">%</div>
                                    )}
                            </div>
                        </div>
                    </div>

                    <div className="bottom flex space-x-4">
                        <div className="bottom-left flex-1">
                            <Keypad
                                input={
                                    activeInput === 'discount'
                                        ? customDiscount
                                        : cashInput
                                }
                                setInput={
                                    activeInput === 'discount'
                                        ? setCustomDiscount
                                        : setCashInput
                                }
                                isCheckout={true}
                            />
                        </div>
                        <div className="bottom-right flex-1 flex flex-col items-center justify-end space-y-5">
                            <div
                                className="bg-amber-400 w-full mx-3 py-3 text-center font-semibold text-2xl text-black rounded-md"
                                onClick={() => paymentSubmit('later')}
                            >
                                PAY LATER
                            </div>
                            <div
                                className="bg-green-500 w-full mx-3 py-3 text-center font-semibold text-2xl text-white rounded-md"
                                onClick={() => paymentSubmit('now')}
                            >
                                PAY
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="checkout-main p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Checkout</h2>

                <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">
                        Payment Method
                    </h3>
                    <div className="flex space-x-4 mb-2">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                                className="mr-2"
                            />
                            <span>Card</span>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                value="cash"
                                checked={paymentMethod === 'cash'}
                                onChange={() => setPaymentMethod('cash')}
                                className="mr-2"
                            />
                            <span>Cash</span>
                        </div>
                    </div>

                    {paymentMethod === 'card' && (
                        <div className="card-options flex space-x-4">
                            <div
                                className="card-option p-4 border rounded cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => setCardType('non-integrated')}
                                style={{
                                    backgroundColor:
                                        cardType === 'non-integrated'
                                            ? '#e0e0e0'
                                            : 'white',
                                }}
                            >
                                <h4 className="font-semibold">
                                    Non-Integrated
                                </h4>
                                <p className="text-sm">Manual card entry</p>
                            </div>
                            <div
                                className="card-option p-4 border rounded cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => setCardType('integrated')}
                                style={{
                                    backgroundColor:
                                        cardType === 'integrated'
                                            ? '#e0e0e0'
                                            : 'white',
                                }}
                            >
                                <h4 className="font-semibold">Integrated</h4>
                                <p className="text-sm">Connected card reader</p>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'cash' && (
                        <div className="cash-input mt-2">
                            <input
                                type="number"
                                value={cashInput}
                                onChange={(e) => setCashInput(e.target.value)}
                                placeholder="Enter cash amount"
                                className="w-full p-2 border rounded"
                                onFocus={() => setActiveInput('cash')}
                            />
                            <div className="w-full">
                                {' '}

                                <Keypad
                                    input={cashInput}
                                    setInput={setCashInput}
                                    isCheckout={true}
                                />
                            </div>
                            {changeOrDue.type !== 'none' && (
                                <p
                                    className={`mt-2 ${changeOrDue.type === 'change' ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    {changeOrDue.type === 'change'
                                        ? 'Change due: '
                                        : 'Amount still due: '}
                                    ${changeOrDue.amount.toFixed(2)}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Discount</h3>
                    <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="0">No Discount</option>
                        <option value="10">10%</option>
                        <option value="20">20%</option>
                        <option value="50">50%</option>
                        <option value="custom">Custom</option>
                    </select>
                    {discountType === 'custom' && (
                        <div>
                            <input
                                type="number"
                                value={customDiscount}
                                onChange={(e) =>
                                    setCustomDiscount(e.target.value)
                                }
                                placeholder="Enter custom discount %"
                                className="w-full p-2 border rounded mt-2"
                                onFocus={() => setActiveInput('discount')}
                            />
                            <div className="w-full">
                                {' '}

                                <Keypad
                                    input={customDiscount}
                                    setInput={setCustomDiscount}
                                    isCheckout={true}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div> */}
        </>
    );
}

export default CheckoutMain;
