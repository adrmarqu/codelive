import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { PATHS } from '@/routes/paths'

import Form from '@/components/Forms/Form/Form.jsx'
import Input from '@/components/Forms/Input/Input.jsx'

import './Login.css'

function Login({setIsLogged})
{
    const { t } = useTranslation();

    return (
        <Form 
            name="login"
            action="/api/auth/login"
            setIsLogged={setIsLogged}
            path={PATHS.HOME}
        >
            <Input type="email" name="email" label={t('form.email')}/>
            <Input type="password" name="pass" label={t('form.pass')}/>
            <div id='form-box'>
                <input type="checkbox" name="remember"/>
                <label id='remember' className='link' htmlFor="remember">
                    {t('form.login.remember')}
                </label>
            </div>
            <Link id='forgot' to={`${PATHS.AUTH.VERIFY}/password`}>
                {t('form.login.forgot')}
            </Link>
        </Form>
    );
}

export default Login