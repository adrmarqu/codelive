import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getUserData } from './services/user.js'
import { PATHS } from './routes/paths.js'

import MainLayout from './components/layout/Main/MainLayout.jsx'

/* Misc */
import Home from './pages/others/Home/Home.jsx'
import Error from './pages/others/Error/Error.jsx'
import Terms from './pages/others/Terms/Terms.jsx'
import Contact from './pages/others/Contact/Contact.jsx'

/* Auth */
import Signin from './pages/auth/Signin/Signin.jsx'
import Login from './pages/auth/Login/Login.jsx'
import Verify from './pages/auth/Verify/Verify.jsx'

/* Core (learn) */
import Learn from './pages/core/Learn.jsx'

/* Stats */
import Ranking from './pages/stats/Ranking/Ranking.jsx'
import Progress from './pages/stats/Progress/Progress.jsx'

/* Profile */
import Profile from './pages/profile/Profile/Profile.jsx'
import Update from './pages/profile/Update/Update.jsx'

/* Edit / Admin */
import Create from './pages/edit/Create/Create.jsx'
import UserList from './pages/edit/UserList/UserList.jsx'

import './App.css'

/* Route guard: protege según los roles permitidos. Espera a que el rol
   esté resuelto (ready) antes de decidir, para evitar redirecciones en falso. */
function Guard({ ready, role, allow, children })
{
    if (!ready) return <div className="route-loading">Cargando…</div>;
    if (!allow.includes(role)) return <Navigate to={PATHS.ERROR} replace />;
    return children;
}

function App()
{
    const [role, setRole] = useState('admin');
    const [isLogged, setIsLogged] = useState(false);
    const [ready, setReady] = useState(false);

    /* Rol */
    useEffect(() =>
    {
        let active = true;
        const fetchRole = async () =>
        {
            const userRole = await getUserData();
            if (active) { setRole(userRole); setReady(true); }
        };
        fetchRole();
        return () => { active = false; };
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
                {/* Público */}
                <Route path={PATHS.HOME} element={<Home role={role}/>}/>

                {/* Auth — invitado y admin (según roles.md) */}
                <Route path={PATHS.AUTH.SIGNIN} element={
                    <Guard ready={ready} role={role} allow={['guest', 'admin']}><Signin /></Guard>
                }/>
                <Route path={PATHS.AUTH.LOGIN} element={
                    <Guard ready={ready} role={role} allow={['guest', 'admin']}><Login setIsLogged={setIsLogged} /></Guard>
                }/>
                <Route path={PATHS.AUTH.VERIFY} element={<Verify />}/>

                {/* Aprendizaje — requiere sesión */}
                <Route path={PATHS.LEARN} element={
                    <Guard ready={ready} role={role} allow={['user', 'editor', 'admin']}><Learn /></Guard>
                }/>

                {/* Estadísticas — requiere sesión */}
                <Route path={PATHS.RANKING} element={
                    <Guard ready={ready} role={role} allow={['user', 'editor', 'admin']}><Ranking /></Guard>
                }/>
                <Route path="/progress/:username?" element={
                    <Guard ready={ready} role={role} allow={['user', 'editor', 'admin']}><Progress role={role} /></Guard>
                }/>

                {/* Perfil — requiere sesión */}
                <Route path={PATHS.USER.PROFILE} element={
                    <Guard ready={ready} role={role} allow={['user', 'editor', 'admin']}>
                        <Profile setRole={setRole} setIsLogged={setIsLogged} />
                    </Guard>
                }/>
                <Route path={PATHS.USER.UPDATE} element={
                    <Guard ready={ready} role={role} allow={['user', 'editor', 'admin']}><Update /></Guard>
                }/>

                {/* Contacto — cualquier sesión (admin ve bandeja, resto formulario) */}
                <Route path={PATHS.CONTACT} element={
                    <Guard ready={ready} role={role} allow={['user', 'editor', 'admin']}><Contact role={role} /></Guard>
                }/>

                {/* Crear contenido — editor y admin */}
                <Route path={PATHS.CREATE} element={
                    <Guard ready={ready} role={role} allow={['editor', 'admin']}><Create /></Guard>
                }/>
                <Route path={PATHS.EDIT} element={
                    <Guard ready={ready} role={role} allow={['editor', 'admin']}><Create /></Guard>
                }/>

                {/* Lista de usuarios — solo admin */}
                <Route path={PATHS.LIST} element={
                    <Guard ready={ready} role={role} allow={['admin']}><UserList /></Guard>
                }/>
            </Route>

            <Route path={PATHS.TERMS} element={<Terms />}/>

            <Route path={PATHS.ERROR} element={<Error />}/>
            <Route path="*" element={<Error />}/>
        </Routes>
        </>
    );
}

export default App
