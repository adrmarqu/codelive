import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@/components/common/Button/Button.jsx'
import { getRankingRequest } from '@/services/user.js'

import './Ranking.css'

const TABS = [
    { key: 'global',  topKey: 'ranking.top100' },
    { key: 'monthly', topKey: 'ranking.top50'  },
    { key: 'weekly',  topKey: 'ranking.top20'  },
    { key: 'daily',   topKey: 'ranking.top10'  }
];

function Ranking()
{
    const { t } = useTranslation();

    const [type, setType] = useState('global');
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() =>
    {
        let active = true;
        const fetch = async () =>
        {
            setLoading(true);
            setError("");
            try
            {
                const res = await getRankingRequest(type);
                if (active) setRanking(res.data.ranking || []);
            }
            catch
            {
                if (active) setError(t('ranking.error'));
            }
            finally
            {
                if (active) setLoading(false);
            }
        };
        fetch();
        return () => { active = false; };
    }, [type, t]);

    const isGlobal = type === 'global';

    return (
        <section id="ranking-section">
            <h1>{t('ranking.title')}</h1>
            <p className="stats-subtitle">{t('ranking.subtitle')}</p>

            <div className="ranking-tabs">
                {TABS.map((tab) => (
                    <Button
                        key={tab.key}
                        className="btn"
                        variant={type === tab.key ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => setType(tab.key)}
                    >
                        {t(`ranking.${tab.key}`)}
                        <span className="ranking-top">{t(tab.topKey)}</span>
                    </Button>
                ))}
            </div>

            {loading && <p className="stats-loading">{t('loading')}</p>}
            {error && <p className="stats-error">{error}</p>}

            {!loading && !error && (
                ranking.length > 0 ? (
                    <ol className="ranking-list">
                        {ranking.map((r, i) => (
                            <li key={`${r.username}-${i}`} className={`ranking-row pos-${i + 1}`}>
                                <span className="ranking-pos">{i + 1}</span>
                                <span className="ranking-name">{r.username}</span>
                                <span className="ranking-value">
                                    {isGlobal ? `${r.value}%` : `${r.value} ${t('ranking.levels')}`}
                                </span>
                            </li>
                        ))}
                    </ol>
                ) : <p className="stats-empty">{t('ranking.empty')}</p>
            )}
        </section>
    );
}

export default Ranking
