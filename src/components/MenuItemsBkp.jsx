import React, { useState } from "react";
import ItemOptions from "./ItemOptions";

const MenuItems = ({ menu, addToOrder, navigate, location }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [SelectedItem, setSelectedItem] = useState({});

  const checkIfMultiOption = (item) => {
    if (item.has_options) {
      setSelectedItem(item);
      setShowOptions(true);
    } else {
      addToOrder(item);
    }
  };
  return (
    <>
      {showOptions ? (
        <ItemOptions item={SelectedItem} />
      ) : (
        menu &&
        (menu.includes("render_child_together") ? (
          <div className={` grid grid-cols-1 ${menu.length - 1}`}>
            {menu?.map(
              (item) =>
                item !== "render_child_together" && (
                  <div>
                    <p className=' text-3xl'>{item}</p>
                    <p>{JSON.stringify(menu)}</p>
                    {menu[item]?.map((sub_item) => {
                      <div>{sub_item}</div>;
                    })}
                  </div>
                )
            )}
          </div>
        ) : (
          menu?.map((item) =>
            item.item_name ? (
              <div
                className=' text-lg md:text-xl w-2/12 max-w-32 text-center justify-center items-center flex aspect-square active:shadow-none cursor-pointer bg-blue-200 px-4 py-2 rounded-lg shadow-sm m-2 relative flex-col space-y-2 shadow-slate-100'
                onClick={() => {
                  checkIfMultiOption(item);
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
          )
        ))
      )}
    </>
  );
};

export default MenuItems;
