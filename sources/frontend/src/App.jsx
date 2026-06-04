import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getUserRole } from './services/user.js'
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
/* Learn */
/* Edit */
/* Update */
/* Admin */
import Create from './pages/admin/Create/Create.jsx'

import './App.css'

function App()
{
    const navigate = useNavigate();
    const [role, setRole] = useState('guest');
    const [isLogged, setIsLogged] = useState(false);

    /* Rol */
    useEffect(() =>
    {
        const fetchRole = async () =>
        {
            const userRole = await getUserRole();
            setRole(userRole);
        };

        fetchRole();
    }, [isLogged]);

    return (
        <>
        <Routes>
            <Route element={<MainLayout role={role} setRole={setRole} setIsLogged={setIsLogged}/> }>
                <Route path={PATHS.HOME} element={<Home role={ role }/>}/>
                <Route path={PATHS.AUTH.SIGNIN} element={<Signin />}/>
                <Route path={PATHS.AUTH.LOGIN} element={<Login setIsLogged={setIsLogged} />}/>
                <Route path={PATHS.AUTH.VERIFY} element={<Verify />}/>

                <Route path={PATHS.EDIT.COURSE} element={<Create />} />
                <Route path={PATHS.EDIT.MODULE} element={<Create />} />
                <Route path={PATHS.EDIT.LEVELS} element={<Create />} />
                <Route path={PATHS.EDIT.LESSON} element={<Create />} />
            </Route>

            <Route path={PATHS.TERMS} element={<Terms />}/>

            <Route path={PATHS.ERROR} element={<Error />}/>
            <Route path="*" element={<Error />}/>
        </Routes>
        </>
    );
}

export default App