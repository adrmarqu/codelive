import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getUserData } from './services/user.js'
import { PATHS } from './routes/paths.js'

import MainLayout from './components/layout/Main/MainLayout.jsx'

/* Misc */
import Home from './pages/others/Home/Home.jsx'
import Error from './pages/others/Error/Error.jsx'
import Terms from './pages/others/Terms/Terms.jsx'

/* Auth */
import Signin from './pages/auth/Signin/Signin.jsx'
import Login from './pages/auth/Login/Login.jsx'
/* import Recover from './pages/auth/Recover/Recover.jsx' */
import Verify from './pages/auth/Verify/Verify.jsx'
/* User */
import Learn from './pages/core/Learn.jsx'
/* Edit */
/* Update */
/* Admin */
import Create from './pages/edit/Create/Create.jsx'

import './App.css'

function App()
{
    const [role, setRole] = useState('guest');
    const [isLogged, setIsLogged] = useState(false);

    /* Rol */
    useEffect(() =>
    {
        const fetchRole = async () =>
        {
            const userRole = await getUserData();
            setRole(userRole);
        };

        fetchRole();
    }, [isLogged]);

    return (
        <>
        <Helmet>
            <title>CodeLive — Plataforma Interactiva para Aprender Programación</title>
            <meta name="description" content="Aprende HTML, CSS, JavaScript, PHP, Node.js y bases de datos con nuestra plataforma interactiva y gamificada. ¡Lleva tus habilidades al siguiente nivel!" />
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta property="og:title" content="CodeLive — Aprende Programación Gratis" />
            <meta property="og:description" content="Cursos y niveles interactivos para dominar el desarrollo web de forma sencilla." />
        </Helmet>
        
        <Routes>
            <Route element={<MainLayout role={role} setRole={setRole} setIsLogged={setIsLogged}/> }>
                <Route path={PATHS.HOME} element={<Home role={ role }/>}/>
                <Route path={PATHS.AUTH.SIGNIN} element={<Signin />}/>
                <Route path={PATHS.AUTH.LOGIN} element={<Login setIsLogged={setIsLogged} />}/>
                <Route path={PATHS.AUTH.VERIFY} element={<Verify />}/>

                <Route path={PATHS.LEARN} element={<Learn />} />
                <Route path={PATHS.EDIT} element={<Create />} />
            </Route>

            <Route path={PATHS.TERMS} element={<Terms />}/>

            <Route path={PATHS.ERROR} element={<Error />}/>
            <Route path="*" element={<Error />}/>
        </Routes>
        </>
    );
}

export default App