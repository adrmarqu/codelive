import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import './App.css'

import Header from './components/layout/header/Header.jsx'
import Footer from './components/layout/footer/Footer.jsx'

import Home from './pages/others/Home/Home.jsx'

import { PATHS } from '@/routes/paths.js'

function App()
{
    const navigate = useNavigate();

    return (
        <>
        <Header />
        <Routes>
            <Route path={PATHS.HOME} element={<Home />}/>
        </Routes>
        <Footer />
        </>
    );
}

export default App