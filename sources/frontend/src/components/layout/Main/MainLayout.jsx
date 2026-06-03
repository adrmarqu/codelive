import { Outlet } from "react-router-dom"

import Header from "@/components/layout/Header/Header.jsx";
import Footer from "@/components/layout/Footer/Footer.jsx";

function MainLayout({ role, setRole })
{
    return (
        <>
        <Header role={role} setRole={setRole} />
        <main>
            <Outlet />
        </main>
        <Footer />
        </>
    );
}

export default MainLayout