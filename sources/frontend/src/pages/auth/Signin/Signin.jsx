import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { PATHS } from '@/routes/paths'

import Form from '@/components/forms/Form/Form.jsx'
import Input from '@/components/forms/Input/Input.jsx'

import './Signin.css'

function Signin()
{
    const { t } = useTranslation();

    return (
        <Form 
            name="signin"
            action="/api/auth/signin"
            path={PATHS.HOME}
        >
            <Input name="user" label={t('form.user')}/>
            <Input type="email" name="email" label={t('form.email')}/>
            <Input type="password" name="pass" label={t('form.pass')}/>
            <Input type="password" name="rep" label={t('form.pass_rep')}/>
            <div id='form-terms'>
                <input type="checkbox" name="terms"/>
                <Link
                    to={PATHS.TERMS} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <label className='link' htmlFor="terms">{t('form.terms')}</label>
                </Link>
            </div>
        </Form>
    );
}

export default Signin