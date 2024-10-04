import React from 'react';

const AdminHome = () => {
    const navOptions = [
        {
            title: 'Check Employee Attendance',
            href: '/attendance',
        },
        {
            title: 'some option 1',
            href: '#',
        },
        {
            title: 'some option 2',
            href: '#',
        },
        {
            title: 'some option 3',
            href: '#',
        },
        {
            title: 'some option 4',
            href: '#',
        },
        {
            title: 'some option 5',
            href: '#',
        },
    ];
    return (
        <div className="px-6 py-4 h-full">
            <p className=" my-2 text-2xl font-semibold ">Admin Actions</p>
            <div className=" grid grid-cols-4 gap-2">
                {navOptions.map((option) => (
                    <div
                        key={option.title}
                        className=" w-full px-4 py-3 min-h-32 flex items-center justify-center border bg-white hover:bg-gray-100 cursor-pointer"
                        onClick={() => (window.location.href += option.href)}
                    >
                        {option.title}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminHome;
