import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNav = () => {
    const navigate = useNavigate();
    return (
        <>
            <div class="nav w-full bg-adminPrimary flex items-center justify-between px-4 text-adminText">
                <div class="flex items-center justify-center space-x-8">
                    <div
                        class="text-3xl cursor-pointer py-3 px-3 w-24"
                        onClick={() => navigate('/admin')}
                    >
                        Colab
                    </div>

                    <div
                        class="text-xl cursor-pointer py-3 px-3 hover:font-semibold w-24"
                        onClick={() => navigate('/admin')}
                    >
                        Admin
                    </div>

                    <div
                        class="text-xl cursor-pointer py-3 px-3 hover:font-semibold w-24"
                        onClick={() => navigate('/admin/attendance')}
                    >
                        Attendance
                    </div>
                    <div
                        class="text-xl cursor-pointer py-3 px-3 hover:font-semibold w-24"
                        onClick={() => navigate('/admin/eod')}
                    >
                        Reports
                    </div>
                </div>
                <div className="w-full  flex items-center justify-end my-2 px-0 space-x-4">
                    <div class="text-xl cursor-pointer py-3 px-3 hover:font-semibold w-24 text-right">
                        Signout
                    </div>
                    <div
                        className=" w-52 px-4 py-3 flex items-center justify-center border  hover:brightness-110 cursor-pointer rounded-md bg-adminPrimary text-adminText shadow-xl"
                        onClick={() => navigate('/menu')}
                    >
                        {'<--'} {'  '} Go back to menu
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminNav;
