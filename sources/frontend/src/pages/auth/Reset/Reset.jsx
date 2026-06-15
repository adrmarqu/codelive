import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PATHS } from '@/routes/paths'
import api from '@/services/api.js'
import './Reset.css'

function Reset()
{
    const { t }       = useTranslation();
    const { token }   = useParams();

    const [pass, setPass]       = useState('');
    const [rep, setRep]         = useState('');
    const [status, setStatus]   = useState('validating'); // validating | valid | invalid | loading | success | error
    const [message, setMessage] = useState('');

    /* Validar token al montar */
    useEffect(() =>
    {
        if (!token) { setStatus('invalid'); return; }

        api.get(`/api/auth/recover/validate/${token}`)
            .then(() => setStatus('valid'))
            .catch(() => setStatus('invalid'));
    }, [token]);

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setMessage('');

        if (!pass || !rep)
            return setMessage(t('form.reset.empty'));

        if (pass !== rep)
            return setMessage(t('form.reset.mismatch'));

        setStatus('loading');

        try
        {
            await api.post('/api/auth/recover/reset', { token, pass, rep });
            setStatus('success');
        }
        catch (err)
        {
            setStatus('error');
            setMessage(err.response?.data?.message || t('form.reset.error'));
        }
    };

    /* ── Renderizado por estado ─────────────────────────────── */

    if (status === 'validating')
        return (
            <section id='section-form'>
                <h1>{t('form.reset.welcome')}</h1>
                <p className='reset-status-msg'>{t('loading')}</p>
            </section>
        );

    if (status === 'invalid')
        return (
            <section id='section-form'>
                <h1>{t('form.reset.welcome')}</h1>
                <div id='form' className='reset-card'>
                    <output id='form-error'>{t('form.reset.invalid_token')}</output>
                    <div id='form-btn-container'>
                        <Link to={PATHS.AUTH.RECOVER} className='btn btn-primary'>
                            {t('form.reset.request_new')}
                        </Link>
                    </div>
                </div>
            </section>
        );

    if (status === 'success')
        return (
            <section id='section-form'>
                <h1>{t('form.reset.welcome')}</h1>
                <div id='form' className='reset-card'>
                    <output id='form-error' className='success'>
                        {t('form.reset.done')}
                    </output>
                    <div id='form-btn-container'>
                        <Link to={PATHS.AUTH.LOGIN} className='btn btn-primary'>
                            {t('form.recover_request.back_login')}
                        </Link>
                    </div>
                </div>
            </section>
        );

    return (
        <section id='section-form'>
            <h1>{t('form.reset.welcome')}</h1>
            <h3>{t('form.reset.intro')}</h3>

            <form id='form' onSubmit={handleSubmit} noValidate>
                <h3>{t('form.reset.title')}</h3>

                {message && (
                    <output id='form-error'>{message}</output>
                )}

                <div className='input-group'>
                    <label htmlFor='reset-pass'>{t('form.pass')}</label>
                    <input
                        id='reset-pass'
                        type='password'
                        value={pass}
                        onChange={e => setPass(e.target.value)}
                        required
                        autoComplete='new-password'
                        placeholder='········'
                    />
                </div>

                <div className='input-group'>
                    <label htmlFor='reset-rep'>{t('form.pass_rep')}</label>
                    <input
                        id='reset-rep'
                        type='password'
                        value={rep}
                        onChange={e => setRep(e.target.value)}
                        required
                        autoComplete='new-password'
                        placeholder='········'
                    />
                </div>

                <p className='reset-hint'>{t('form.reset.hint')}</p>

                <div id='form-btn-container'>
                    <Link to={PATHS.AUTH.LOGIN} className='btn btn-secondary'>
                        {t('form.cancel')}
                    </Link>
                    <button
                        type='submit'
                        className='btn btn-primary'
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? t('loading') : t('form.reset.submit')}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default Reset
