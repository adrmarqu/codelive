import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Button from '@/components/common/Button/Button.jsx'
import {
    updateUsernameRequest,
    updateEmailRequest,
    updatePasswordRequest
} from '@/services/user.js'

import './Update.css'

const VALID = ['username', 'email', 'password'];

function Update()
{
    const { type } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [fields, setFields] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (!VALID.includes(type))
        return <Navigate to="/error" replace />;

    const onChange = (e) => setFields({ ...fields, [e.target.name]: e.target.value });

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setError("");
        setSuccess("");

        try
        {
            let res;
            if (type === 'username')
                res = await updateUsernameRequest(fields.username || "");
            else if (type === 'email')
                res = await updateEmailRequest(fields.email || "");
            else
                res = await updatePasswordRequest(fields.current || "", fields.pass || "", fields.rep || "");

            setSuccess(res.data.message || t('update.success'));
            setTimeout(() => navigate('/profile'), 1400);
        }
        catch (err)
        {
            setError(err.response?.data?.message || t('update.error'));
        }
    };

    return (
        <section id="update-section">
            <form className="update-form" onSubmit={handleSubmit}>
                <h1>{t(`update.title.${type}`)}</h1>

                {error && <output className="update-msg update-error">{error}</output>}
                {success && <output className="update-msg update-success">{success}</output>}

                {type === 'username' && (
                    <div className="form-container">
                        <label className="form-label" htmlFor="username">{t('form.user')}</label>
                        <input className="form-input" type="text" name="username" onChange={onChange} autoFocus />
                    </div>
                )}

                {type === 'email' && (
                    <div className="form-container">
                        <label className="form-label" htmlFor="email">{t('form.email')}</label>
                        <input className="form-input" type="email" name="email" onChange={onChange} autoFocus />
                    </div>
                )}

                {type === 'password' && (
                    <>
                        <div className="form-container">
                            <label className="form-label" htmlFor="current">{t('update.current_pass')}</label>
                            <input className="form-input" type="password" name="current" onChange={onChange} autoFocus />
                        </div>
                        <div className="form-container">
                            <label className="form-label" htmlFor="pass">{t('form.pass')}</label>
                            <input className="form-input" type="password" name="pass" onChange={onChange} />
                        </div>
                        <div className="form-container">
                            <label className="form-label" htmlFor="rep">{t('form.pass_rep')}</label>
                            <input className="form-input" type="password" name="rep" onChange={onChange} />
                        </div>
                    </>
                )}

                <div className="update-btns">
                    <Button className="btn btn-secondary" onClick={() => navigate('/profile')}>
                        {t('form.cancel')}
                    </Button>
                    <Button className="btn btn-primary" type="submit" onClick={handleSubmit}>
                        {t('form.save')}
                    </Button>
                </div>
            </form>
        </section>
    );
}

export default Update
