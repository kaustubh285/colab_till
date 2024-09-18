import React, { useState, useEffect } from "react";
import Keypad from "./Keypad";

function CheckoutMain({ cartItems, updateOrderList }) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardType, setCardType] = useState("non-integrated");
  const [discountType, setDiscountType] = useState("0");
  const [customDiscount, setCustomDiscount] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [cashInput, setCashInput] = useState("");
  const [changeOrDue, setChangeOrDue] = useState({ amount: 0, type: "none" });
  const [activeInput, setActiveInput] = useState(null); // 'cash' or 'discount'

  const handleKeypadInput = (value) => {
    if (activeInput === "cash") {
      setCashInput(value);
    } else if (activeInput === "discount") {
      setCustomDiscount(value);
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [cartItems, discountType, customDiscount]);

  useEffect(() => {
    if (paymentMethod === "cash" && cashInput) {
      const difference = parseFloat(cashInput) - total;
      if (difference >= 0) {
        setChangeOrDue({ amount: difference, type: "change" });
      } else {
        setChangeOrDue({ amount: Math.abs(difference), type: "due" });
      }
    } else {
      setChangeOrDue({ amount: 0, type: "none" });
    }
  }, [paymentMethod, cashInput, total]);

  const calculateTotals = () => {
    const newSubtotal = cartItems.reduce(
      (sum, item) => sum + item.item_price_eat_in * item.count,
      0
    );
    let discountPercentage = 0;

    switch (discountType) {
      case "10":
        discountPercentage = 0.1;
        break;
      case "20":
        discountPercentage = 0.2;
        break;
      case "50":
        discountPercentage = 0.5;
        break;
      case "custom":
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

    // Update OrderList
    updateOrderList(newSubtotal, newDiscount, newTotal);
  };

  return (
    <div className="checkout-main p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
        <div className="flex space-x-4 mb-2">
          <div className="flex items-center">
            <input
              type="radio"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="mr-2"
            />
            <span>Card</span>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
              className="mr-2"
            />
            <span>Cash</span>
          </div>
        </div>

        {paymentMethod === "card" && (
          <div className="card-options flex space-x-4">
            <div
              className="card-option p-4 border rounded cursor-pointer hover:bg-gray-100 transition"
              onClick={() => setCardType("non-integrated")}
              style={{
                backgroundColor:
                  cardType === "non-integrated" ? "#e0e0e0" : "white",
              }}
            >
              <h4 className="font-semibold">Non-Integrated</h4>
              <p className="text-sm">Manual card entry</p>
            </div>
            <div
              className="card-option p-4 border rounded cursor-pointer hover:bg-gray-100 transition"
              onClick={() => setCardType("integrated")}
              style={{
                backgroundColor:
                  cardType === "integrated" ? "#e0e0e0" : "white",
              }}
            >
              <h4 className="font-semibold">Integrated</h4>
              <p className="text-sm">Connected card reader</p>
            </div>
          </div>
        )}

        {paymentMethod === "cash" && (
          <div className="cash-input mt-2">
            <input
              type="number"
              value={cashInput}
              onChange={(e) => setCashInput(e.target.value)}
              placeholder="Enter cash amount"
              className="w-full p-2 border rounded"
              onFocus={() => setActiveInput("cash")}
            />
            <div className="w-full">
              {" "}
              {/* Added this wrapper div */}
              <Keypad
                input={cashInput}
                setInput={setCashInput}
                isCheckout={true}
              />
            </div>
            {changeOrDue.type !== "none" && (
              <p
                className={`mt-2 ${changeOrDue.type === "change" ? "text-green-600" : "text-red-600"}`}
              >
                {changeOrDue.type === "change"
                  ? "Change due: "
                  : "Amount still due: "}
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
        {discountType === "custom" && (
          <div>
            <input
              type="number"
              value={customDiscount}
              onChange={(e) => setCustomDiscount(e.target.value)}
              placeholder="Enter custom discount %"
              className="w-full p-2 border rounded mt-2"
              onFocus={() => setActiveInput("discount")}
            />
            <div className="w-full">
              {" "}
              {/* Added this wrapper div */}
              <Keypad
                input={customDiscount}
                setInput={setCustomDiscount}
                isCheckout={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutMain;
