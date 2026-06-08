import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PATHS } from '@/routes/paths';
import './Footer.css'

function Footer()
{
    const year = new Date().getFullYear();

    const { t } = useTranslation();

    return (
        <footer className="site-footer">
            <div className="footer-top">
                <Link to={PATHS.HOME} className="footer-brand" aria-label="CodeLive home">
                    <span className="footer-mark">&lt;/&gt;</span>
                    <span>CodeLive</span>
                </Link>

                <nav className="footer-links">
                    <Link to={PATHS.TERMS} target="_blank" rel="noopener noreferrer">
                        {t('form.terms')}
                    </Link>
                    <Link to={PATHS.CONTACT}>{t('contact')}</Link>
                </nav>
            </div>

            <div className="footer-divider" />

            <p className="footer-copy">
                © {year} CodeLive · {t('copyright')}
            </p>
        </footer>
    );
}

export default Footer
