import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Button from '@/components/common/Button/Button.jsx'
import { getProfileRequest, deleteAccountRequest } from '@/services/user.js'

import './Profile.css'

function Profile({ setRole, setIsLogged })
{
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() =>
    {
        const fetchProfile = async () =>
        {
            try
            {
                const { data } = await getProfileRequest();
                setUser(data);
            }
            catch
            {
                setError(t('profile.error_load'));
            }
        };
        fetchProfile();
    }, [t]);

    const goUpdate = (type) => navigate(`/profile/update/${type}`);

    const handleDelete = async () =>
    {
        if (!window.confirm(t('profile.delete_confirm'))) return;

        try
        {
            await deleteAccountRequest();
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
            if (setIsLogged) setIsLogged(false);
            if (setRole) setRole('guest');
            navigate('/');
        }
        catch
        {
            setError(t('profile.error_delete'));
        }
    };

    if (error)
        return <section id="profile-section"><p className="profile-error">{error}</p></section>;

    if (!user)
        return <section id="profile-section"><p>{t('loading')}</p></section>;

    return (
        <section id="profile-section">
            <div className="profile-card">
                <div className="profile-avatar">{user.username?.charAt(0).toUpperCase()}</div>
                <h1>{user.username}</h1>
                <span className={`profile-badge role-${user.rol}`}>{t(`role.${user.rol}`)}</span>

                <ul className="profile-data">
                    <li>
                        <span>{t('form.user')}</span>
                        <strong>{user.username}</strong>
                        <Button className="btn btn-secondary" onClick={() => goUpdate('username')}>{t('form.edit')}</Button>
                    </li>
                    <li>
                        <span>{t('form.email')}</span>
                        <strong>{user.email}</strong>
                        <Button className="btn btn-secondary" onClick={() => goUpdate('email')}>{t('form.edit')}</Button>
                    </li>
                    <li>
                        <span>{t('form.pass')}</span>
                        <strong>••••••••</strong>
                        <Button className="btn btn-secondary" onClick={() => goUpdate('password')}>{t('form.edit')}</Button>
                    </li>
                </ul>

                <Button className="btn btn-danger profile-delete" onClick={handleDelete}>
                    {t('profile.delete')}
                </Button>
            </div>
        </section>
    );
}

export default Profile
