import React, { useEffect, useMemo, useState } from "react";
import ItemOptions from "./ItemOptions";

const MenuItems = ({
  menu,
  addToOrder,
  navigate,
  location,
  subMenu,
  breadcrumbs,
}) => {
  const meta_data_list = ["render_child_together", "image_url"];
  const [showOptions, setShowOptions] = useState(false);
  const [SelectedItem, setSelectedItem] = useState({});
  const [currentMenuSection, setCurrentMenuSection] = useState([]);
  const [completeMenu, setCompleteMenu] = useState({});
  const checkIfMultiOption = (item) => {
    if (item.has_options) {
      setSelectedItem(item);
      setShowOptions(true);
    } else {
      addToOrder(item);
    }
  };

  const getData = () => {
    fetch("/menu.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(async function (response) {
      let res = await response.json();
      setCompleteMenu(res);
      // const currentPath = location.pathname.replace("/menu", ""); // Remove the base path

      // setMenu(getSubMenu(res.menu, currentPath));
    });
  };

  useEffect(() => {
    getData();
  }, [breadcrumbs, location]);

  useEffect(() => {
    const getCurrentMenuSection = (path) => {
      let menu = currentMenuSection;
      return path.reduce((acc, crumb) => {
        if (acc && typeof acc === "object" && crumb in acc) {
          return acc[crumb];
        }
        return undefined;
      }, menu);
    };

    const sub_routes = location.pathname.split("/");
    const currMenu = getCurrentMenuSection(breadcrumbs);

    if (currMenu !== undefined) {
      let val = {
        render_child_together: true,
        coffee: [
          {
            item_id: 1,
            item_name: "Espresso",
            item_description: "coffee",
            item_price_eat_in: 2.6,
            item_price_takeaway: 2.6,
            item_contents: "Espresso coffee",
            item_topic: "hot_drinks",
          },
          {
            item_id: 2,
            item_name: "Flat White",
            item_description: "coffee",
            item_price_eat_in: 3.2,
            item_price_takeaway: 3.2,
            item_contents: "Milk, coffee",
            item_topic: "hot_drinks",
          },
          {
            item_id: 3,
            item_name: "Latte",
            item_description: "coffee",
            item_price_eat_in: 3.2,
            item_price_takeaway: 3.2,
            item_contents: "Milk, coffee",
            item_topic: "hot_drinks",
            has_options: true,
            options: {
              syrups: ["vanilla", "hazelnut"],
              milks: ["oat", "almond", "coconut", "soya"],
            },
          },
          {
            item_id: 4,
            item_name: "Cappuccino",
            item_description: "coffee",
            item_price_eat_in: 3.2,
            item_price_takeaway: 3.2,
            item_contents: "Milk, coffee",
            item_topic: "hot_drinks",
          },
          {
            item_id: 5,
            item_name: "Mocha",
            item_description: "coffee",
            item_price_eat_in: 3.5,
            item_price_takeaway: 3.5,
            item_contents: "Milk, coffee, chocolate",
            item_topic: "hot_drinks",
          },
        ],
        others: [
          {
            item_id: 6,
            item_name: "Chai Latte",
            item_description: "other_hot_drinks",
            item_price_eat_in: 3.3,
            item_price_takeaway: 3.3,
            item_contents: "Milk, chai spices",
            item_topic: "hot_drinks",
          },
          {
            item_id: 7,
            item_name: "Matcha Latte",
            item_description: "other_hot_drinks",
            item_price_eat_in: 3.3,
            item_price_takeaway: 3.3,
            item_contents: "Milk, matcha",
            item_topic: "hot_drinks",
          },
          {
            item_id: 8,
            item_name: "Turmeric Latte",
            item_description: "other_hot_drinks",
            item_price_eat_in: 3.3,
            item_price_takeaway: 3.3,
            item_contents: "Milk, turmeric",
            item_topic: "hot_drinks",
          },
          {
            item_id: 9,
            item_name: "Beetroot Latte",
            item_description: "other_hot_drinks",
            item_price_eat_in: 3.3,
            item_price_takeaway: 3.3,
            item_contents: "Milk, beetroot",
            item_topic: "hot_drinks",
          },
          {
            item_id: 10,
            item_name: "Chai Matcha",
            item_description: "other_hot_drinks",
            item_price_eat_in: 3.5,
            item_price_takeaway: 3.5,
            item_contents: "Milk, chai spices, matcha",
            item_topic: "hot_drinks",
          },
          {
            item_id: 11,
            item_name: "Hot Chocolate",
            item_description: "other_hot_drinks",
            item_price_eat_in: 3.5,
            item_price_takeaway: 3.5,
            item_contents: "Milk, chocolate",
            item_topic: "hot_drinks",
          },
          {
            item_id: 12,
            item_name: "Lotus Hot Choc",
            item_description: "other_hot_drinks",
            item_price_eat_in: 3.75,
            item_price_takeaway: 3.75,
            item_contents: "Milk, chocolate, lotus biscoff",
            item_topic: "hot_drinks",
          },
        ],
      };
      setCurrentMenuSection(menu);
    } else {
      // Handle the case where the path is invalid
      console.error("Invalid menu path:", breadcrumbs);
      // You might want to set a default menu section or navigate to a safe location
      setCurrentMenuSection(completeMenu.menu);
    }
  }, [location]);

  const renderGridItems = () => {
    const number_of_cols = `grid-cols-${Object.keys(subMenu).length - 1}`;
    return (
      <div
        className={`flex flex-row justify-around items-center w-full ${number_of_cols} h-full overflow-scroll `}>
        {subMenu &&
          Object.entries(subMenu).map(([category, categoryItems]) => {
            if (Array.isArray(categoryItems)) {
              let divisible_by_5 = Math.ceil(categoryItems.length / 5);
              let no_of_sub_cols = `grid-cols-${divisible_by_5}`;
              return (
                <div className=' flex flex-col h-full'>
                  <h3 className='text-xl font-bold mb-2 text-white'>
                    {category}
                  </h3>
                  <div
                    key={category}
                    className={` grid ${no_of_sub_cols} h-full items-stretch  justify-start `}>
                    {categoryItems.map((item) => (
                      <>
                        {/* <div
                      key={item.item_id}
                      className='bg-white p-2 rounded shadow cursor-pointer'
                      onClick={() => checkIfMultiOption(item)}>
                      {item.item_name} - ${item.item_price_eat_in}
                    </div> */}

                        <div
                          key={item.item_id}
                          className='bg-white p-1 rounded shadow cursor-pointer m-2 px-2 py-1 w-32 flex items-center justify-center max-h-32'
                          onClick={() => checkIfMultiOption(item)}>
                          <p>
                            {item.item_name}--{" "}
                            <span className=' font-light text-sm'>
                              ${item.item_price_eat_in}
                            </span>
                          </p>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
      </div>
    );
  };
  try {
    if (menu.includes("Hello")) {
    }
  } catch {
    console.log(JSON.stringify(menu));
  }
  return (
    <>
      {showOptions ? (
        <ItemOptions item={SelectedItem} />
      ) : (
        menu &&
        (menu.includes("render_child_together") &&
        subMenu.render_child_together ? (
          <>
            {/* <div className={` grid grid-cols-1 ${menu.length - 1}`}>
              {menu?.map(
                (item) =>
                  item !== "render_child_together" && (
                    <div className=' text-white'>
                      <p className=' text-3xl'>{item}</p>
                      <p>{JSON.stringify(subMenu)}1111</p>
                      {subMenu.item?.map((sub_item) => {
                        <div>{sub_item}</div>;
                      })}
                    </div>
                  )
              )}
            </div> */}

            {renderGridItems()}
          </>
        ) : (
          menu?.map((item) =>
            item.item_name ? (
              <>
                <div
                  key={item.item_id}
                  className='bg-white p-2 rounded shadow cursor-pointer m-2 px-2 py-4 w-32 aspect-square flex items-center justify-center relative'
                  onClick={() => checkIfMultiOption(item)}>
                  {item.item_name}
                  <div className=' absolute bottom-1 right-3'>
                    ${item.item_price_eat_in}
                  </div>
                </div>
                {/* <div
                  className=' text-lg md:text-xl w-2/12 max-w-32 text-center justify-center items-center flex aspect-square active:shadow-none cursor-pointer bg-blue-200 px-4 py-2 rounded-lg shadow-sm m-2 relative flex-col space-y-2 shadow-slate-100'
                  onClick={() => {
                    checkIfMultiOption(item);
                  }}>
                  <div className=' py-2'>{item.item_name}</div>
                </div> */}
              </>
            ) : (
              !meta_data_list.includes(item) &&
              (subMenu[item].image_url ? (
                <div
                  className=' text-lg md:text-xl w-2/12 md:min-w-2/12 text-center justify-start items-center flex aspect-square active:shadow-none cursor-pointer bg-blue-200  rounded-lg shadow-md m-2 flex-col'
                  onClick={() => {
                    navigate(`${location.pathname}/${item}`);
                  }}>
                  {subMenu[item].image_url && (
                    <img
                      className=' flex-1 object-contain  w-full'
                      src={subMenu[item]?.image_url}
                      height={130}
                      width={130}
                      alt={item}
                    />
                  )}
                  {item}
                </div>
              ) : (
                <>
                  <div
                    className=' text-lg md:text-xl w-2/12 md:min-w-2/12 text-center justify-center items-center flex aspect-square active:shadow-none cursor-pointer bg-blue-200 px-4 py-2 rounded-lg shadow-md m-2 flex-col'
                    onClick={() => {
                      navigate(`${location.pathname}/${item}`);
                    }}>
                    {item}
                  </div>
                </>
              ))
            )
          )
        ))
      )}
    </>
  );
};

export default MenuItems;
