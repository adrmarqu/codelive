import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import './Header.css'

/* import Logo from '@/assets/icons/logo' */
import Button from '@/components/common/button/Button.jsx'
import { PATHS } from '@/routes/paths.js'
import { getUserRole } from '@/services/user'

function Header()
{
    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState(true);
    const [role, setRole] = useState('guest');

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() =>
    {
        const fetchRole = async () =>
        {
            const userRole = await getUserRole();
            setRole(userRole);
        };

        fetchRole();
    }, []);

    const AuthLinks = () =>
    {
        return (
            <>
            <Link to={PATHS.AUTH.LOGIN}>{t('header.login')}</Link>
            <Link to={PATHS.AUTH.SIGNIN}>{t('header.signin')}</Link>
            </>
        );
    };

    const UserLinks = () =>
    {
        return (
            <>
            <Link to={PATHS.PROFILE}>{t('header.profile')}</Link>
            <Link to={PATHS.PROGRESS}>{t('header.progress')}</Link>
            <Link to={PATHS.RANKING}>{t('header.ranking')}</Link>
            </>
        );
    };

    const AdminLinks = () =>
    {
        return (
            <>
            {role === 'admin' && (
                <>
                <Link to={PATHS.CONTACT}>{t('header.contact')}</Link>
                <Link to={PATHS.LIST}>{t('header.list')}</Link>
                </>
            )}
            {role === 'editor' && (
                <Link to={PATHS.EDIT.COURSES}>{t('header.create')}</Link>
            )}
            </>
        );
    };

    const LDButton = () =>
    {
        return (
            <Button>L/D</Button>
        );
    }

    const LogoutButton = () =>
    {
        return (
            <Button>Logout</Button>
        );
    };

    const DropdownMenu = () =>
    {
        return (
            <>
            {role === 'guest' && (
                <>
                <AuthLinks />
                <LDButton />
                </>
            )}
            {role === 'user' && (
                <>
                <UserLinks />
                <LDButton />
                <LogoutButton />
                </>
            )}
            {role === 'editor' && (
                <>
                <UserLinks />
                <AdminLinks />
                <LDButton />
                <LogoutButton />
                </>
            )}
            {role === 'admin' && (
                <>
                <AuthLinks />
                <UserLinks />
                <AdminLinks />
                <LDButton />
                <LogoutButton />
                </>
            )}
            </>
        );
    };

    return (
        <header>
            <Link to={PATHS.HOME}>
                CodeLive
            </Link>

            <nav>
                <Button variant={`burger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </Button>

                <div className={`dropdown ${isOpen ? '' : 'hidden'}`}>
                    <DropdownMenu />
                </div>
            </nav>
        </header>
    );
}

export default Header