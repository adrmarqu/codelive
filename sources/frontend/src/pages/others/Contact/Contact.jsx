import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Button from '@/components/common/Button/Button.jsx'
import { sendContactRequest, getContactsRequest } from '@/services/user.js'

import './Contact.css'

/* Dispatcher: el admin ve la bandeja, el resto el formulario */
function Contact({ role })
{
    return role === 'admin' ? <ContactInbox /> : <ContactForm />;
}

function ContactForm()
{
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!comment.trim()) { setError(t('contact.empty')); return; }

        try
        {
            await sendContactRequest(comment.trim());
            setSuccess(t('contact.success'));
            setComment("");
        }
        catch (err)
        {
            setError(err.response?.data?.message || t('contact.error'));
        }
    };

    return (
        <section id="contact-section">
            <form className="contact-form" onSubmit={handleSubmit}>
                <h1>{t('contact.title')}</h1>
                <p className="stats-subtitle">{t('contact.subtitle')}</p>

                {error && <output className="update-msg update-error">{error}</output>}
                {success && <output className="update-msg update-success">{success}</output>}

                <textarea
                    className="contact-textarea"
                    placeholder={t('contact.placeholder')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={6}
                />

                <div className="contact-btns">
                    <Button className="btn btn-secondary" onClick={() => navigate('/')}>
                        {t('form.cancel')}
                    </Button>
                    <Button className="btn btn-primary" type="submit" onClick={handleSubmit}>
                        {t('form.send')}
                    </Button>
                </div>
            </form>
        </section>
    );
}

function ContactInbox()
{
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");

    useEffect(() =>
    {
        const fetch = async () =>
        {
            try { const res = await getContactsRequest(); setMessages(res.data); }
            catch { setError(t('contact.error')); }
        };
        fetch();
    }, [t]);

    const fmt = (d) => new Date(d).toLocaleString(i18n.language);

    return (
        <section id="contact-section">
            <h1>{t('contact.inbox_title')}</h1>
            {error && <p className="stats-error">{error}</p>}

            <div className="contact-inbox">
                {messages.length > 0
                    ? messages.map((m) => (
                        <article key={m.id} className="contact-message">
                            <header>
                                <strong>{m.username || t('contact.deleted_user')}</strong>
                                <span>{fmt(m.send_at)}</span>
                            </header>
                            <p>{m.comment}</p>
                        </article>
                    ))
                    : !error && <p className="stats-empty">{t('contact.inbox_empty')}</p>}
            </div>
        </section>
    );
}

export default Contact
