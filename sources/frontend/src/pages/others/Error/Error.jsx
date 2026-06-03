import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"

function Error()
{
    const { t } = useTranslation();

    const location = useLocation();

    const errorCode = location.state?.status || "404";
    const content = location.state?.message || "Error";

    return (
        <div>
            <h1>Error {errorCode}</h1>
            <h3>{t(errorCode)}</h3>
            <p>Url: {location.pathname}</p><br />
            <p>{content}</p>
            <Link className="btn btn-primary" to="/">Home</Link>
        </div>
    );
}

export default Error