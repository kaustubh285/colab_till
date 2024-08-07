import { useState, useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
// import Unauth from "./page/Unauth";
import Home from "./page/Home";
import Menu from "./page/Menu";

function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          {/* <Route path='/' element={<Unauth />} /> */}
          <Route path='/menu/*' element={<Menu />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
