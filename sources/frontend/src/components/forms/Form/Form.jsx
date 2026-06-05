import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import Button from '@/components/common/button/Button.jsx'
import { Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths.js'
import { checkForm } from '@/services/auth.js'

import './Form.css'

function Form({name, action = "", method = "post", children = "", setIsLogged = null, onSubmit = null, path})
{
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [error, setError] = useState("");

    const sendForm = async (e) =>
    {
        e.preventDefault();

        const formData = new FormData(e.target.form);

        const result = await checkForm(name, formData);

        if (result.success)
        {
            if (name === 'login')
                setIsLogged(true);
            navigate(path);
        }
        else
            setError(result.error);
    };

    const returnForm = (e) =>
    {
        e.preventDefault();

        if (window.history.state && window.history.state.idx > 0)
            navigate(-1);
        else
            navigate(PATHS.HOME);
    };

    return(
        <section id='section-form'>
        <h1>{t(`form.${name}.welcome`)}</h1>    
        <h3>{t(`form.${name}.intro`)}</h3>

        <form id='form' action={action} method={method} onSubmit={onSubmit}>
            <h3>{t(`form.${name}.title`)}</h3>
            <output id='form-error' className={error ? '' : 'hidden'}>
                {error}
            </output>
            {children}
            <div id='form-btn-container'>
                <Button className="btn btn-secondary" onClick={returnForm}>
                    {t('form.cancel')}
                </Button>
                <Button className="btn btn-primary" type="submit" onClick={sendForm}>
                    {t('form.send')}
                </Button>
            </div>
            {name === 'login' && (
                <p id='sign-text'>
                    {t('form.login.account_no')}
                    <Link id='login-signin' to={PATHS.AUTH.SIGNIN}>
                        {t('form.login.account_sign')}
                    </Link>
                </p>
            )}
        </form>
        </section>
    );
}

export default Form