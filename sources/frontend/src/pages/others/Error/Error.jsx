import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"

import { PATHS } from "@/routes/paths"
import './Error.css'

function Error()
{
    const { t } = useTranslation();
    const location = useLocation();

    const errorCode = location.state?.status || "404";

    return (
        <main className="error-page">
            <div className="error-glow" />

            <Link to={PATHS.HOME} className="error-brand" aria-label="CodeLive home">
                <span className="error-mark">&lt;/&gt;</span>
                <span>Code<span className="error-accent">Live</span></span>
            </Link>

            <p className="error-code">{errorCode}</p>
            <h1 className="error-title">{t(errorCode)}</h1>
            <p className="error-path">{location.pathname}</p>

            <Link to={PATHS.HOME} className="btn btn-primary error-home">
                {t('back') || 'Volver'} → CodeLive
            </Link>
        </main>
    );
}

export default Error
