import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import './App.css'

import Init from './pages/Init.jsx'
import Home from './pages/Home.jsx'

function App()
{
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/" element={<Init/>}/>
            <Route path="/home" element={<Home/>}/>
        </Routes>
    );
}

export default App