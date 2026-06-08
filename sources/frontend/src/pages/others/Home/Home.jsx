import { useTranslation } from 'react-i18next'

import { Link } from 'react-router-dom'
import { PATHS, ICON_MAP } from '@/routes/paths.js'
import Feature from '@/components/containers/Features/Feature.jsx'
import './Home.css'

function Home({ role })
{
    const { t } = useTranslation();

    const featureContent = (
        <>
        <Feature 
            path={PATHS.LEARN}
            icon={ICON_MAP.HIGH}
            title={t('feature.title.high')}
            text={t('feature.text.high')}
        />
        <Feature 
            path={role === 'guest' ? PATHS.LEARN : PATHS.PROGRESS}
            icon={ICON_MAP.PROGRESS}
            title={t('feature.title.progress')}
            text={t('feature.text.progress')}
        />
        <Feature 
            path={PATHS.LEARN}
            icon={ICON_MAP.LIMIT}
            title={t('feature.title.limit')}
            text={t('feature.text.limit')}
        />
        </>
    );

    const featureContentExtra = (
        <>
        {(role === 'user' || role === 'editor' || role === 'admin') && (
        <Feature 
            path={PATHS.RANKING}
            icon={ICON_MAP.RANKING}
            title={t('feature.title.ranking')}
            text={t('feature.text.ranking')}
        />
        )}

        {(role === 'editor' || role === 'admin') && (
        <Feature 
            path={PATHS.CREATE}
            icon={ICON_MAP.CREATE}
            title={t('feature.title.create')}
            text={t('feature.text.create')}
        />   
        )}

        {role === 'admin' && (
        <Feature 
            path={PATHS.LIST}
            icon={ICON_MAP.LIST}
            title={t('feature.title.list')}
            text={t('feature.text.list')}
        />
        )}
        </>
    );
    
    return (
        <main>
            <section id='hero'>
                <div id='hero-card'>
                    <span className='hero-eyebrow'>
                        <span className='hero-dot' /> HTML · CSS · JS · PHP · Node · SQL
                    </span>
                    <h1>{t('welcome')}</h1>
                    <p>{t('intro')}</p>
                    <Link 
                        to={PATHS.LEARN}
                        id='home-link'
                        className='btn btn-primary'
                    >
                        {t('start')}
                    </Link>
                </div>
            </section>

            <section id='features'>
                {featureContent}
                {featureContentExtra}
            </section>
        </main>
    );
}

export default Home