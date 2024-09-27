import React, { useEffect, useMemo, useState } from 'react';
import ItemOptions from './ItemOptions';
import { addToOrder } from '../helper/menuHelper';

const MenuItems = ({
    menu,
    navigate,
    location,
    subMenu,
    breadcrumbs,
    groupedOrder,
    setGroupedOrder,
}) => {
    const meta_data_list = ['render_child_together', 'image_url'];
    const [showOptions, setShowOptions] = useState(false);
    const [SelectedItem, setSelectedItem] = useState({});
    const [currentMenuSection, setCurrentMenuSection] = useState([]);
    const [completeMenu, setCompleteMenu] = useState({});
    const checkIfMultiOption = (item) => {
        if (item.has_options) {
            setSelectedItem(item);
            setShowOptions(true);
        } else {
            addToOrder(item, groupedOrder, setGroupedOrder);
        }
    };

    const addToOrderWithOptions = (item) => {
        addToOrder(item, groupedOrder, setGroupedOrder);
        setSelectedItem({});
        setShowOptions(false);
    };

    const getData = () => {
        fetch('/menu.json', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
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
                if (acc && typeof acc === 'object' && crumb in acc) {
                    return acc[crumb];
                }
                return undefined;
            }, menu);
        };

        const sub_routes = location.pathname.split('/');
        const currMenu = getCurrentMenuSection(breadcrumbs);

        if (currMenu !== undefined) {
            setCurrentMenuSection(menu);
        } else {
            // Handle the case where the path is invalid
            console.error('Invalid menu path:', breadcrumbs);
            // You might want to set a default menu section or navigate to a safe location
            setCurrentMenuSection(completeMenu.menu);
        }
    }, [location]);

    const renderGridItems = () => {
        const number_of_cols = `grid-cols-${Object.keys(subMenu).length - 1}`;
        return (
            <div
                className={`flex flex-row justify-around items-center w-full ${number_of_cols} h-full overflow-scroll `}
            >
                {subMenu &&
                    Object.entries(subMenu).map(([category, categoryItems]) => {
                        if (Array.isArray(categoryItems)) {
                            let divisible_by_5 = Math.ceil(
                                categoryItems.length / 5,
                            );
                            let no_of_sub_cols = `grid-cols-${divisible_by_5}`;
                            return (
                                <div className=" flex flex-col h-full">
                                    <h3 className="text-xl font-bold mb-2 text-white">
                                        {category}
                                    </h3>
                                    <div
                                        key={category}
                                        className={` grid ${no_of_sub_cols} h-full items-stretch  justify-start `}
                                    >
                                        {categoryItems.map((item) => (
                                            <>
                                                <div
                                                    key={item.item_id}
                                                    className="bg-white p-1 rounded shadow cursor-pointer m-2 px-2 py-1 w-32 flex items-center justify-center max-h-32"
                                                    onClick={() =>
                                                        checkIfMultiOption(item)
                                                    }
                                                >
                                                    <p>
                                                        {item.item_name}--{' '}
                                                        <span className=" font-light text-sm">
                                                            $
                                                            {
                                                                item.item_price_eat_in
                                                            }
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

    return (
        <>
            {showOptions && (
                <div className=" absolute top-0 left-0 right-0 bottom-0 bg-black opacity-65"></div>
            )}
            {showOptions && (
                <ItemOptions
                    item={SelectedItem}
                    addToOrderWithOptions={addToOrderWithOptions}
                />
            )}
            {menu &&
                (menu.includes('render_child_together') &&
                subMenu.render_child_together ? (
                    <>{renderGridItems()}</>
                ) : (
                    menu?.map((item) =>
                        item.item_name ? (
                            <>
                                <div
                                    key={item.item_id}
                                    className="bg-white p-2 rounded shadow cursor-pointer m-2 px-2 py-4 w-32 aspect-square flex items-center justify-center relative"
                                    onClick={() => checkIfMultiOption(item)}
                                >
                                    {item.item_name}
                                    <div className=" absolute bottom-1 right-3">
                                        ${item.item_price_eat_in}
                                    </div>
                                </div>
                            </>
                        ) : (
                            !meta_data_list.includes(item) &&
                            (subMenu[item].image_url ? (
                                <div
                                    className=" text-lg md:text-xl w-2/12 md:min-w-2/12 text-center justify-start items-center flex aspect-square active:shadow-none cursor-pointer bg-blue-200  rounded-lg shadow-md m-2 flex-col"
                                    onClick={() => {
                                        navigate(
                                            `${location.pathname}/${item}`,
                                        );
                                    }}
                                >
                                    {subMenu[item].image_url && (
                                        <img
                                            className=" flex-1 object-contain  w-full"
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
                                        className=" text-lg md:text-xl w-2/12 md:min-w-2/12 text-center justify-center items-center flex aspect-square active:shadow-none cursor-pointer bg-blue-200 px-4 py-2 rounded-lg shadow-md m-2 flex-col"
                                        onClick={() => {
                                            navigate(
                                                `${location.pathname}/${item}`,
                                            );
                                        }}
                                    >
                                        {item.split('_').join(' ')}
                                    </div>
                                </>
                            ))
                        ),
                    )
                ))}
        </>
    );
};

export default MenuItems;
