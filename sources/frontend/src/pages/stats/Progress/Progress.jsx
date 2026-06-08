import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { getProgressRequest, getUserProgressRequest } from '@/services/user.js'

import './Progress.css'

function Progress({ role })
{
    const { t } = useTranslation();
    const { username } = useParams();

    /* Solo el admin puede ver el progreso de otro usuario */
    const viewingOther = Boolean(username) && role === 'admin';

    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() =>
    {
        const fetch = async () =>
        {
            try
            {
                const res = viewingOther
                    ? await getUserProgressRequest(username)
                    : await getProgressRequest();
                setData(res.data);
            }
            catch
            {
                setError(t('progress.error'));
            }
        };
        fetch();
    }, [t, username, viewingOther]);

    if (error)
        return <section id="progress-section"><p className="stats-error">{error}</p></section>;

    if (!data)
        return <section id="progress-section"><p>{t('loading')}</p></section>;

    return (
        <section id="progress-section">
            <h1>{viewingOther ? `${t('progress.title')} · ${username}` : t('progress.title')}</h1>
            <p className="stats-subtitle">{t('progress.subtitle')}</p>

            <div className="progress-summary">
                <div className="summary-card">
                    <span className="summary-value">{data.weekly}</span>
                    <span className="summary-label">{t('progress.weekly')}</span>
                </div>
                <div className="summary-card">
                    <span className="summary-value">{data.monthly}</span>
                    <span className="summary-label">{t('progress.monthly')}</span>
                </div>
                <div className="summary-card highlight">
                    <span className="summary-value">{data.completed}/{data.total}</span>
                    <span className="summary-label">{t('progress.total')}</span>
                </div>
            </div>

            <div className="progress-global">
                <div className="progress-global-head">
                    <strong>{t('progress.global')}</strong>
                    <span>{data.percent}%</span>
                </div>
                <div className="bar"><div className="bar-fill" style={{ width: `${data.percent}%` }} /></div>
            </div>

            <h2 className="progress-languages-title">{t('progress.by_language')}</h2>
            <div className="progress-languages">
                {data.courses && data.courses.length > 0
                    ? data.courses.map((c) => (
                        <div key={c.course_id} className="lang-row">
                            <div className="lang-head">
                                <strong>{c.course_name}</strong>
                                <span>{c.completed}/{c.total} · {c.percent}%</span>
                            </div>
                            <div className="bar"><div className="bar-fill" style={{ width: `${c.percent}%` }} /></div>
                        </div>
                    ))
                    : <p className="stats-empty">{t('progress.empty')}</p>}
            </div>
        </section>
    );
}

export default Progress
