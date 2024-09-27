import React, { useState } from 'react';

const ItemOptions = ({ item, addToOrderWithOptions }) => {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [optionCount, setOptionCount] = useState(0);

    const handleOptionSelect = (type, option) => {
        setSelectedOptions((prev) => {
            const prevSelected = prev[type] || [];
            const isSelected = prevSelected.some(
                (opt) => opt.name === option.name,
            );

            if (isSelected) {
                // Remove the option
                setOptionCount(optionCount - 1);
                return {
                    ...prev,
                    [type]: prevSelected.filter(
                        (opt) => opt.name !== option.name,
                    ),
                };
            } else {
                // Add the option
                if (optionCount === item.option_limit) {
                    alert(`Only ${item.option_limit} additions allowed`);
                    return { ...prev, [type]: [...prevSelected] };
                }
                setOptionCount(optionCount + 1);
                return {
                    ...prev,
                    [type]: [...prevSelected, option],
                };
            }
        });
    };

    const calculateExtraCost = () => {
        // Dynamically calculate extra cost based on selected options
        return Object.keys(selectedOptions).reduce((totalCost, type) => {
            return (
                totalCost +
                selectedOptions[type].reduce(
                    (sum, option) => sum + option.cost,
                    0,
                )
            );
        }, 0);
    };

    const handleDone = () => {
        const optionsString = Object.keys(selectedOptions)
            .flatMap((type) =>
                selectedOptions[type].map((opt) => opt.name).sort(),
            )
            .join('-');

        // Calculate the final extra cost
        const extraCost = calculateExtraCost();

        const itemWithOptions = {
            ...item,
            item_name: `${item.item_name}-${optionsString}`,
            item_price_eat_in: item.item_price_eat_in + extraCost,
        };

        // Add the item with correct price and options
        addToOrderWithOptions(itemWithOptions);
    };

    return (
        <div
            className="z-50 bg-gray-200 absolute w-5/6 p-5 shadow-xl"
            style={{
                height: '70vh',
            }}
        >
            <div className="flex items-center justify-around text-black w-full h-4/5 bg-blue-100 flex-wrap ">
                {Object.keys(item.options).map((typ) => (
                    <div
                        key={typ}
                        className="flex flex-col items-center justify-around  space-y-6 flex-1 h-full flex-wrap"
                    >
                        <p className="text-2xl">{typ}</p>
                        {item.options[typ].map((option) => (
                            <div
                                key={option.name}
                                className={`text-lg md:text-xl min-w-24 max-w-56 text-center justify-center items-center flex aspect-square cursor-pointer bg-blue-200 px-4 py-2 rounded-lg shadow-sm m-2 relative flex-col space-y-2 text-slate-800 ${
                                    (selectedOptions[typ] || []).some(
                                        (opt) => opt.name === option.name,
                                    )
                                        ? 'bg-blue-400'
                                        : 'bg-blue-200'
                                }`}
                                onClick={() => handleOptionSelect(typ, option)}
                            >
                                {option.name}{' '}
                                {option.cost > 0 && (
                                    <span className="text-sm">
                                        (+${option.cost.toFixed(2)})
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div
                className="float-right px-4 py-2 bg-green-200 text-3xl mt-12 cursor-pointer"
                onClick={handleDone}
            >
                Done (Total: $
                {(item.item_price_eat_in + calculateExtraCost()).toFixed(2)})
            </div>
        </div>
    );
};

export default ItemOptions;
