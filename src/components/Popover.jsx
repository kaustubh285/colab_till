import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Popover = ({ showExtraActions, setShowExtraActions }) => {
    const [isVisible, setIsVisible] = useState(false); // Manages the visibility state of the popover
    const popoverRef = useRef(null); // Reference to the popover element
    const triggerRef = useRef(null); // Reference to the button element that triggers the popover
    const navigate = useNavigate();

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target)
            ) {
                setShowExtraActions(false);
                // Close the popover if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            className="bg-white flex flex-col space-y-2 absolute top-0 right-0 bottom-0 px-3 py-4 z-40"
            ref={popoverRef}
        >
            <div className="px-2 py-3 border-b border-dotted cursor-pointer hover:font-semibold min-w-56 italic">
                Logout
            </div>
            <div className="px-2 py-3 border-b border-dotted cursor-pointer hover:font-semibold min-w-56 italic">
                Latest Reciept
            </div>
            <div className="px-2 py-3 border-b border-dotted cursor-pointer hover:font-semibold min-w-56 italic">
                <button onClick={() => navigate('/checkTableOrder')}>
                    Check Table Order
                </button>
            </div>
            <div className="px-2 py-3 border-b border-dotted cursor-pointer hover:font-semibold min-w-56 italic">
                <button onClick={() => navigate('/refund')}>Refund</button>
            </div>
            <div className="px-2 py-3 border-b border-dotted cursor-pointer hover:font-semibold min-w-56 italic">
                Admin
            </div>
            <div className="px-2 py-3 border-b border-dotted cursor-pointer hover:font-semibold min-w-56 italic">
                Reverse Order
            </div>
            <button
                className=" absolute bottom-0 right-0 left-0 py-3  bg-gray-600 text-white hover:bg-gray-700"
                onClick={() => setShowExtraActions(false)}
            >
                Close Menu
            </button>
        </div>
    );
};

export default Popover;
