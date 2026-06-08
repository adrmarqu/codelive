import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PATHS } from '@/routes/paths';
import './Footer.css'

function Footer()
{
    const year = new Date().getFullYear();

    const { t } = useTranslation(); 

    return (
        <footer>
            <p id="copyright">
                Copyright: © {year} CodeLive. {t('copyright')}
            </p>
            <div id='footer-data'>
                <Link
                    to={PATHS.TERMS} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    <label htmlFor="terms">{t('form.terms')}</label>
                </Link>
                <Link to={PATHS.CONTACT}>{t('contact')}</Link>
            </div>
        </footer>
    );
}

export default Footer