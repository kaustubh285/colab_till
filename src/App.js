import { useState, useEffect } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Unauth from './page/Unauth';
import Menu from './page/Menu';
import Dashboard from './page/Dashboard';
import Checkout from './page/Checkout';
import TableOrder from './page/TableOrder';
import Admin from './page/Admin';

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Unauth />} />
                    <Route path="/admin/*" element={<Admin />} />
                    <Route path="/menu/*" element={<Menu />} />
                    <Route path="/dashboard/" element={<Dashboard />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkTableOrder" element={<TableOrder />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default App;
