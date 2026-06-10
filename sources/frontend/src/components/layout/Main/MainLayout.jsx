import { Outlet } from "react-router-dom"

import Header from "@/components/layout/Header/Header.jsx";
import Footer from "@/components/layout/Footer/Footer.jsx";

function MainLayout({ role, setRole, setIsLogged })
{
    return (
        <>
        <Header role={role} setRole={setRole} setIsLogged={setIsLogged}/>
        <main className="main-content">
            <Outlet />
        </main>
        <Footer />
        </>
    );
}

export default MainLayout