import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { PATHS } from '@/routes/paths'

import Form from '@/components/Forms/Form/Form.jsx'
import Input from '@/components/Forms/Input/Input.jsx'

import './Recover.css'

function Recover()
{
    const { t } = useTranslation();

    return (
        <Form 
            name="recover"
            action="/api/auth/recover"
        >
            <Input type="email" name="email" label={t('form.email')}/>
            <Input type="password" name="pass" label={t('form.pass')}/>
            <div id='form-box'>
                <input type="checkbox" name="remember"/>
                <label id='remember' className='link' htmlFor="remember">
                    {t('form.login.remember')}
                </label>
            </div>
            <Link id='forgot' to={PATHS.AUTH.RECOVER}>
                {t('form.login.forgot')}
            </Link>
        </Form>
    );
}

export default Recover