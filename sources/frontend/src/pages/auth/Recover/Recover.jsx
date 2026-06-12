import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PATHS } from '@/routes/paths'
import api from '@/services/api.js'
import './Recover.css'

function Recover()
{
    const { t } = useTranslation();

    const [email, setEmail]     = useState('');
    const [status, setStatus]   = useState('idle'); // idle | loading | success | error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        if (!email.trim())
            return setMessage(t('form.recover_request.empty'));

        setStatus('loading');
        setMessage('');

        try
        {
            const { data } = await api.post('/api/auth/recover', { email });
            setStatus('success');
            setMessage(data.message || t('form.recover_request.sent'));
        }
        catch (err)
        {
            setStatus('error');
            setMessage(err.response?.data?.message || t('form.recover_request.error'));
        }
    };

    return (
        <section id='section-form'>
            <h1>{t('form.recover_request.welcome')}</h1>
            <h3>{t('form.recover_request.intro')}</h3>

            <form id='form' onSubmit={handleSubmit} noValidate>
                <h3>{t('form.recover_request.title')}</h3>

                {message && (
                    <output
                        id='form-error'
                        className={status === 'success' ? 'success' : ''}
                    >
                        {message}
                    </output>
                )}

                {status !== 'success' && (
                    <>
                        <div className='input-group'>
                            <label htmlFor='recover-email'>{t('form.email')}</label>
                            <input
                                id='recover-email'
                                type='email'
                                name='email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete='email'
                                placeholder='tu@email.com'
                            />
                        </div>

                        <div id='form-btn-container'>
                            <Link to={PATHS.AUTH.LOGIN} className='btn btn-secondary'>
                                {t('form.cancel')}
                            </Link>
                            <button
                                type='submit'
                                className='btn btn-primary'
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? t('loading') : t('form.send')}
                            </button>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <div id='form-btn-container'>
                        <Link to={PATHS.AUTH.LOGIN} className='btn btn-primary'>
                            {t('form.recover_request.back_login')}
                        </Link>
                    </div>
                )}
            </form>
        </section>
    );
}

export default Recover