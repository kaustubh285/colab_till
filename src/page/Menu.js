import React, { useEffect, useState } from "react";
import MenuNav from "../components/MenuNav";
import { useLocation, useNavigate } from "react-router-dom";
import MenuFeatures from "../components/MenuFeatures";
import OrderList from "../components/OrderList";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState([]);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [userDets, setUserDets] = useState({});

  const getSubMenu = (menu, subRoute) => {
    let subMenu = menu;
    const routeParts = subRoute.split("/").filter((part) => part); // Split and filter out empty strings

    for (const part of routeParts) {
      if (subMenu[part]) {
        subMenu = subMenu[part];
      } else {
        // If the route part doesn't exist in the menu, return an empty object or handle the error as needed
        return {};
      }
    }

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
    console.log(user_dets);
    setUserDets(user_dets);
    if (!user_dets) {
      navigate("/");
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
      console.log(res);

      const currentPath = location.pathname.replace("/menu", ""); // Remove the base path
      console.log(getSubMenu(res.menu, currentPath));
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
    <div className='h-screen w-screen'>
      <div className='flex flex-col space-y-3 h-full w-full bg-blue-100 p-3'>
        <MenuNav navigate={navigate} userDets={userDets} />
        <div className='flex-1 bg-slate-200 flex flex-col md:flex-row'>
          <OrderList currentOrder={currentOrder} />

          <div className='bg-yellow-200 min-h-32 md:flex-1 flex-col'>
            {menu &&
              menu?.map((item) =>
                item.item_name ? (
                  <div
                    className=' active:shadow-none cursor-pointer bg-blue-200 px-4 py-2 rounded-lg shadow-md m-2 block'
                    onClick={() => {
                      addToOrder(item);
                    }}>
                    {item.item_name}
                  </div>
                ) : (
                  <div
                    className=' active:shadow-none cursor-pointer bg-blue-200 px-4 py-2 rounded-lg shadow-md m-2 block'
                    onClick={() => {
                      navigate(`${location.pathname}/${item}`);
                    }}>
                    {item}
                  </div>
                )
              )}
          </div>
          <MenuFeatures navigate={navigate} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
