import { useState, useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Unauth from "./page/Unauth";
import Home from "./page/Home";

function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Unauth />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
