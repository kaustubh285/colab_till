import React, { useEffect, useState } from "react";
import MenuNav from "../components/MenuNav";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuFeatures from "../components/MenuFeatures";
import OrderList from "../components/OrderList";
import "./Menu.css";
import Popover from "../components/Popover";
import Modals from "../components/Modals";
import MenuItems from "../components/MenuItems";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState([]);

  const [groupedOrder, setGroupedOrder] = useState([]);
  const [userDets, setUserDets] = useState({});
  const [subMenu, setSubMenu] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [tableNum, setTableNum] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [allergiesOption, setAllergiesOption] = useState(false);
  const [orderAllergy, setOrderAllergy] = useState([]);

  const [showMenu, setShowMenu] = useState(false);

  const getSubMenu = (menu, subRoute) => {
    let subMenuTemp = menu;

    const routeParts = subRoute.split("/").filter((part) => part); // Split and filter out empty strings
    setBreadcrumbs(["home", ...routeParts]);
    for (const part of routeParts) {
      if (subMenuTemp[part]) {
        subMenuTemp = subMenuTemp[part];
      } else {
        // If the route part doesn't exist in the menu, return an empty object or handle the error as needed
        return {};
      }
    }
    console.log(subMenuTemp);
    setSubMenu(subMenuTemp);
    if (Array.isArray(subMenuTemp)) {
      // If the subMenu is an array, return it as it is
      return subMenuTemp;
    } else {
      // If subMenu is an object, return its keys
      return Object.keys(subMenuTemp);
    }
  };

  useEffect(() => {
    const user_dets = JSON.parse(localStorage.getItem("user_dets"));

    setUserDets(user_dets);
    if (!user_dets) {
      setUserDets({ id: 2, name: "Kaustubh", code: "696" });
      // navigate("/");
    }
  }, [location.pathname]);

  const getData = () => {
    fetch("/menu.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(async function (response) {
      let res = await response.json();
      // setCompleteMenu(res);
      const currentPath = location.pathname.replace("/menu", ""); // Remove the base path

      let tempVal = getSubMenu(res.menu, currentPath);
      setMenu(tempVal);
      console.log(JSON.stringify(tempVal));
    });
  };

  const handleAddMessage = (item, message) => {
    let order = [...groupedOrder];

    order.forEach((orderItem) => {
      if (orderItem["item_name"] === item.item_name) {
        orderItem["message"] = message;
      }
    });

    setGroupedOrder(order);
    localStorage.setItem("grouped_order", JSON.stringify(groupedOrder));
  };

  const addToOrder = (item) => {
    let order = [...groupedOrder];
    let found = false;

    order.forEach((orderItem) => {
      if (orderItem["item_name"] === item.item_name) {
        orderItem["count"] += 1;
        found = true;
      }
    });
    if (!found) {
      const newItem = { ...item, count: 1, message: "" };
      order = [newItem].concat(groupedOrder);
    }

    setGroupedOrder(order);
    localStorage.setItem("grouped_order", JSON.stringify(groupedOrder));
  };

  useEffect(() => {
    setGroupedOrder(JSON.parse(localStorage.getItem("grouped_order")) || []);
  }, []);

  useEffect(() => {
    getData();
  }, [location.pathname]);

  const handleTableChange = (val) => {
    setTableNum(val);
    setModalOpen(false);
  };

  return (
    <div className='h-screen w-screen flex flex-col overflow-scroll bg-slate-900 relative'>
      {showMenu && (
        <div
          className={` ease-in absolute top-0 right-0 bottom-0 w-full bg-black  py-4  z-40 delay-1000 transition-opacity ${
            showMenu ? "opacity-25" : "opacity-0"
          }`}></div>
      )}

      <Modals
        modalOpen={modalOpen}
        handleTableChange={handleTableChange}
        orderAllergy={orderAllergy}
        setOrderAllergy={setOrderAllergy}
        setAllergiesOption={setAllergiesOption}
        allergiesOption={allergiesOption}
      />

      <div className=' bg-slate-900 flex-1 flex flex-col-reverse md:flex-row overflow-scroll '>
        {/* top */}

        <div className=' bg-slate-50 w-full min-h-16 md:h-full md:w-3/12 hidden md:block max-h-full overflow-scroll relative'>
          {/* Receipt */}
          <OrderList
            orderAllergy={orderAllergy}
            groupedOrder={groupedOrder}
            setGroupedOrder={setGroupedOrder}
            handleAddMessage={handleAddMessage}
            addToOrder={addToOrder}
          />
        </div>

        <div className=' flex-1 flex flex-row-reverse'>
          {/* right */}

          <div className=' w-1/6 border-b border-white grid grid-cols-1 items-stretch gap-3 justify-between text-white px-5 py-4'>
            <div className=' text-xl'>Logged in as : Kaustubh</div>
            <button
              onClick={() => setShowMenu((curr) => !curr)}
              className='text-xl border p-3 cursor-pointer disabled:opacity-75'
              disabled={showMenu}>
              Menu
            </button>
            <div
              className=' flex items-center justify-center text-xl border p-3 cursor-pointer'
              onClick={() => setModalOpen(true)}>
              <p>
                Table number:
                <span> {tableNum}</span>
              </p>
            </div>

            <div
              className=' flex items-center justify-center  text-xl border p-3'
              onClick={() => setAllergiesOption(true)}>
              Allergies
            </div>
            <div className=' flex items-center justify-center  text-xl border p-3'>
              Some option
            </div>

            <div
              className=' flex items-center justify-center  text-white  bg-teal-400  p-3 active:shadow-none cursor-pointer text-xl'
              onClick={() => navigate(-1)}>
              Back
            </div>
          </div>
          <div
            className={`relative flex-1 md:flex md:flex-wrap items-center justify-around content-center grid ${
              menu.length >= 3 ? " grid-cols-3 " : " grid-cols-2 "
            } menu-content h-full overflow-scroll`}>
            {/* body */}

            {showMenu && (
              <>
                <Popover showMenu={showMenu} setShowMenu={setShowMenu} />
              </>
            )}
            {/* {alert(JSON.stringify(breadcrumbs))} */}

            <MenuItems
              menu={menu}
              addToOrder={addToOrder}
              navigate={navigate}
              location={location}
              subMenu={subMenu}
              breadcrumbs={breadcrumbs}
            />
          </div>
        </div>
      </div>

      <div className=' bg-white md:h-max h-40 flex items-center p-1'>
        {/* bottom */}
        <div className=' flex-1'>
          <div
            className=' px-8 py-3 text-white rounded-md bg-red-400 h-max shadow-md active:shadow-none cursor-pointer w-52 text-center  text-3xl'
            onClick={() => {
              if (window.confirm("confirm")) {
                setGroupedOrder([]);
                localStorage.removeItem("grouped_order");
              }
            }}>
            Clear order
          </div>
        </div>
        <div className=' flex items-center space-x-3'>
          <div
            className=' px-8 py-3 text-white rounded-md bg-teal-400 h-max shadow-md active:shadow-none cursor-pointer text-3xl'
            onClick={() => {
              navigate(`/menu`);
            }}>
            Home
          </div>

          <div className=' px-8 py-3 text-white rounded-md bg-blue-400 h-max shadow-md active:shadow-none cursor-pointer text-3xl'>
            Finish
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
