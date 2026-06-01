import { Link } from 'react-router-dom'
import './Footer.css'

import { PATHS } from '@/routes/paths';

function Footer()
{
    const year = new Date().getFullYear();

    return (
        <footer>
            <p id="copyright">
                Copyright: © {year} CodeLive. Todos los derechos reservados.
            </p>
            <div id='footer-data'>
                <Link to={PATHS.TERMS}>Terminos y servicios</Link>
                <Link to={PATHS.CONTACT}>Contacto</Link>
            </div>
        </footer>
    );
}

export default Footer