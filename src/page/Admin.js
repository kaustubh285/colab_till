import React from 'react';
import AdminNav from '../components/Admin/AdminNav';
import CheckEmpClock from '../components/Admin/CheckEmpClock';
import { Routes, Route } from 'react-router-dom';
import AdminHome from '../components/Admin/AdminHome';
import EOD from '../components/Admin/EOD';

const Admin = () => {
    return (
        <div className="h-screen w-screen flex flex-col items-stretch justify-start">
            <AdminNav />

            <Routes>
                <Route path="/" element={<AdminHome />} />

                <Route path="/attendance" element={<CheckEmpClock />} />

                <Route path="/eod" element={<EOD />} />
            </Routes>
        </div>
    );
};

export default Admin;
