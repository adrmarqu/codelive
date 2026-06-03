import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/common/button/Button.jsx'

import './Form.css'

function Form({name, action, method = "post", children = ""})
{
    const { t } = useTranslation();
    const navigate = useNavigate();

    const returnForm = (e) =>
    {
        e.preventDefault();

        if (window.history.state && window.history.state.idx > 0)
            navigate(-1);
        else
            navigate("/");
    };

    return(
        <section id='section-form'>
        <h1>{t(`form.${name}.welcome`)}</h1>    
        <h3>{t(`form.${name}.intro`)}</h3>

        <form id='form' action={action} method={method}>
            <h3>{t(`form.${name}.title`)}</h3>
            <output></output>
            {children}
            <div id='form-btn-container'>
                <Button className="btn btn-secondary" onClick={returnForm}>
                    {t('form.cancel')}
                </Button>
                <Button className="btn btn-primary" type="submit">
                    {t('form.send')}
                </Button>
            </div>
        </form>
        </section>
    );
}

export default Form