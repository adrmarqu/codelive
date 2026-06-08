import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState, useRef } from 'react'

import Button from '@/components/common/Button/Button.jsx'
import { PATHS } from '@/routes/paths.js'

import './Header.css'

function Header({role, setRole, setIsLogged})
{
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenLang, setIsOpenLang] = useState(false);
    const [lang, setLang] = useState(i18n.language);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleLang = () => setIsOpenLang(!isOpenLang);

    const navRef = useRef(null);

    const logout = () =>
    {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLogged(false);
        setRole('guest');
        navigate(PATHS.HOME);
    };

    /* Close dropdown */
    useEffect(() =>
    {
        const handleClickOutside = (event) =>
        {
            if (isOpen && navRef.current && !navRef.current.contains(event.target))
                setIsOpen(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    /* Language */
    const handleLanguage = async (lng) =>
    {
        await i18n.changeLanguage(lng);
        setLang(lng);
    };

    /* Contrast */
    const handleContrast = () =>
    {
        document.body.classList.toggle('dark');
    };

    /* Login + Signin */
    const authLinks = (
        <>
            <Link to={PATHS.AUTH.LOGIN}>{t('header.login')}</Link>
            <Link to={PATHS.AUTH.SIGNIN}>{t('header.signin')}</Link>
        </>
    );

    /* Profile + Progress + Ranking */
    const userLinks = (
        <>
            <Link to={PATHS.USER.PROFILE}>{t('header.profile')}</Link>
            <Link to={PATHS.PROGRESS}>{t('header.progress')}</Link>
            <Link to={PATHS.RANKING}>{t('header.ranking')}</Link>
        </>
    );

    /* Contact + User List + Create */
    const adminLinks = (
        <>
            {role === 'admin' && (
                <>
                    <Link to={PATHS.CONTACT}>{t('header.contact')}</Link>
                    <Link to={PATHS.LIST}>{t('header.list')}</Link>
                </>
            )}
            <Link to={PATHS.CREATE}>{t('header.create')}</Link>
        </>
    );

    /* Language button + Light/Dark button */
    const ldButton = (
        <>
            <div id='header-lang' onClick={(e)=>e.stopPropagation()}>
                <Button
                    className='btn btn-lang'
                    onClick={toggleLang}
                >
                    {t('lang')}
                </Button>

                <div className={`dropdown ${isOpenLang ? '' : 'hidden'}`}>
                    {['es', 'ca', 'en'].map((lng) => (
                        <Button
                            key={lng}
                            className="btn"
                            variant={lang === lng ? 'selected' : ''}
                            onClick={() => handleLanguage(lng)}
                        >
                            {t(lng)}
                        </Button>
                    ))}
                </div>
            </div>

            <Button className="btn btn-contrast" onClick={handleContrast}>
                L/D
            </Button>
        </>
    );

    /* Logout button */
    const logoutButton = (
        <Button
            className="btn btn-danger"
            onClick={logout}
        >
            Logout
        </Button>
    );

    return (
        <header className='header'>
            <Link to={PATHS.HOME}>
                Home
                {/* <img src="@/../public/assets/icons/codelive.png" alt="CodeLive" title='CodeLive' className='header-icon' /> */}
            </Link>

            <nav ref={navRef}>
                <Button variant={`burger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </Button>

                <div className={`dropdown ${isOpen ? '' : 'hidden'}`}>
                    {role === 'guest' && (
                        <>
                            {authLinks}
                            {ldButton}
                        </>
                    )}
                    {role === 'user' && (
                        <>
                            {userLinks}
                            {ldButton}
                            {logoutButton}
                        </>
                    )}
                    {role === 'editor' && (
                        <>
                            {userLinks}
                            {adminLinks}
                            {ldButton}
                            {logoutButton}
                        </>
                    )}
                    {role === 'admin' && (
                        <>
                            {authLinks}
                            {userLinks}
                            {adminLinks}
                            {ldButton}
                            {logoutButton}
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header