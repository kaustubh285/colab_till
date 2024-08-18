import React, { useEffect, useState } from "react";
import MenuNav from "../components/MenuNav";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuFeatures from "../components/MenuFeatures";
import OrderList from "../components/OrderList";
import "./Menu.css";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState([]);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [userDets, setUserDets] = useState({});
  const [completeMenu, setCompleteMenu] = useState({});
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const getSubMenu = (menu, subRoute) => {
    let subMenu = menu;
    const routeParts = subRoute.split("/").filter((part) => part); // Split and filter out empty strings
    setBreadcrumbs(["home", ...routeParts]);
    for (const part of routeParts) {
      if (subMenu[part]) {
        subMenu = subMenu[part];
      } else {
        // If the route part doesn't exist in the menu, return an empty object or handle the error as needed
        return {};
      }
    }
    console.log(subMenu);
    if (Array.isArray(subMenu)) {
      // If the subMenu is an array, return it as it is
      return subMenu;
    } else {
      // If subMenu is an object, return its keys
      return Object.keys(subMenu);
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
      setCompleteMenu(res);
      const currentPath = location.pathname.replace("/menu", ""); // Remove the base path

      setMenu(getSubMenu(res.menu, currentPath));
    });
    setCurrentOrder(JSON.parse(localStorage.getItem("current_order")) || []);
  };

  const deleteFromOrder = (item) => {};
  const addToOrder = (item) => {
    const updatedOrder = [...currentOrder, item];
    setCurrentOrder(updatedOrder);
    localStorage.setItem("current_order", JSON.stringify(updatedOrder));
  };

  useEffect(() => {
    setCurrentOrder(JSON.parse(localStorage.getItem("current_order")) || []);
  }, []);

  useEffect(() => {
    getData();
  }, [location.pathname]);

  return (
    <div className='h-screen w-screen flex flex-col overflow-scroll bg-slate-900'>
      <div className=' bg-slate-900 flex-1 flex flex-col-reverse md:flex-row'>
        {/* top */}

        <div className=' bg-slate-50 w-full min-h-16 md:h-full md:w-3/12 hidden md:block'>
          {/* Receipt */}
          <OrderList currOrder={currentOrder} />
        </div>

        <div className=' flex-1 flex flex-col'>
          {/* right */}

          <div className=' h-20 border-b border-white flex items-center justify-between text-white px-5'>
            <div className=' text-xl'>Logged in as : Kaustubh</div>
            <div className=' text-xl border p-3'>
              Table number:
              <span> 0</span>
            </div>

            <div className=' text-xl border p-3'>Some option1</div>
            <div className=' text-xl border p-3'>Some option2</div>
            <div className=' w-12 aspect-square bg-white rounded-xl px-3 text-black flex flex-col space-y-0'>
              <span>_</span>
              <span>_</span>
            </div>
          </div>
          <div
            className={`flex-1 md:flex md:flex-wrap items-center justify-around content-center grid ${
              menu.length >= 3 ? " grid-cols-3 " : " grid-cols-2 "
            } menu-content`}>
            {/* body */}
            {menu &&
              menu?.map((item) =>
                item.item_name ? (
                  <div
                    className=' text-lg md:text-xl w-2/12 max-w-32 text-center justify-center items-center flex aspect-square active:shadow-none cursor-pointer bg-blue-200 px-4 py-2 rounded-lg shadow-sm m-2 relative flex-col space-y-2 shadow-slate-100'
                    onClick={() => {
                      addToOrder(item);
                    }}>
                    <div className=' py-2'>{item.item_name}</div>
                    {/* <div className=' bg-orange-400  w-full'>
                      {
                        currentOrder.filter(
                          (itm) => itm.item_name === item.item_name
                        ).length
                      }
                    </div> */}
                  </div>
                ) : (
                  <div
                    className=' text-lg md:text-xl w-2/12 md:min-w-2/12 text-center justify-center items-center flex aspect-square active:shadow-none cursor-pointer bg-blue-200 px-4 py-2 rounded-lg shadow-md m-2 '
                    onClick={() => {
                      navigate(`${location.pathname}/${item}`);
                    }}>
                    {item}
                  </div>
                )
              )}
          </div>
          <div className=' border-t border-white px-5 py-2'>
            <div
              className=' text-white float-right  px-8 py-3 rounded-md bg-teal-400 h-max shadow-md active:shadow-none cursor-pointer'
              onClick={() => navigate(-1)}>
              Back
            </div>
          </div>
        </div>
      </div>

      <div className=' bg-white md:h-max h-20 flex p-3 items-center'>
        {/* bottom */}
        <div className=' flex-1'>
          <div
            className=' px-8 py-3 text-white rounded-md bg-red-400 h-max shadow-md active:shadow-none cursor-pointer w-52 text-center '
            onClick={() => {
              setCurrentOrder([]);
              localStorage.removeItem("current_order");
            }}>
            Clear order
          </div>
        </div>
        <div className=' flex items-center space-x-3'>
          <div className=' px-8 py-3 text-white rounded-md bg-teal-400 h-max shadow-md active:shadow-none cursor-pointer'>
            Home
          </div>

          <div className=' px-8 py-3 text-white rounded-md bg-blue-400 h-max shadow-md active:shadow-none cursor-pointer'>
            Finish
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
