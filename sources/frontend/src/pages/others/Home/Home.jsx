import { useTranslation } from 'react-i18next'

import { Link } from 'react-router-dom'
import { PATHS, ICON_MAP } from '@/routes/paths.js'
import Feature from '@/components/Containers/Features/Feature.jsx'
import './Home.css'

function Home({ role })
{
    const { t } = useTranslation();

    const FeatureContent = () =>
    {
        return (
            <>
            <Feature 
                path={PATHS.LEARN.COURSE}
                icon={ICON_MAP.HIGH}
                title={t('feature.title.high')}
                text={t('feature.text.high')}
            />
            <Feature 
                path={PATHS.LEARN.COURSE}
                icon={ICON_MAP.PROGRESS}
                title={t('feature.title.progress')}
                text={t('feature.text.progress')}
            />
            <Feature 
                path={PATHS.LEARN.COURSE}
                icon={ICON_MAP.LIMIT}
                title={t('feature.title.limit')}
                text={t('feature.text.limit')}
            />
            </>
        );
    };

    const FeatureContentExtra = () =>
    {
        return (
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
                path={PATHS.EDIT.COURSE}
                icon={ICON_MAP.CREATE}
                title={t('feature.title.create')}
                text={t('feature.text.create')}
            />   
            )}

            {role === 'admin' && (
            <Feature 
                path={PATHS.LEARN.LIST}
                icon={ICON_MAP.LIST}
                title={t('feature.title.list')}
                text={t('feature.text.list')}
            />
            )}
            </>
        );
    };
    
    return (
        <main>
            <section id='hero'>
                <div id='hero-card'>
                    <h1>{t('welcome')}</h1>
                    <p>{t('intro')}</p>
                    <Link 
                        to={PATHS.LEARN.COURSE}
                        id='home-link'
                        className='btn btn-primary'
                    >
                        {t('start')}
                    </Link>
                </div>
            </section>

            <section id='features'>
                <FeatureContent />
                <FeatureContentExtra />
            </section>
        </main>
    );
}

export default Home