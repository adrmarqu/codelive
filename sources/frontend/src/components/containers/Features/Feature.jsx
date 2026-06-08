import { Link } from 'react-router-dom'
import './Feature.css'

function Feature({ path = '/', icon, title = 'head', text = 'text' })
{
    return (
        <Link to={path} className='feature-link'>
            <article className='feature-card'>
                <img className='icon' src={icon.src} alt={icon.alt} title={icon.title} />
                <h3>{title}</h3>
                <p>{text}</p>
            </article>
        </Link>
    );
}

export default Feature