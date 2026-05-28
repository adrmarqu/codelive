import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

function Init()
{
    const navigate = useNavigate();

    return(
        <>
        <Helmet>
            <title>CodeLive | Init</title>
        </Helmet>
        <button onClick={() => navigate('/home')}>
            Ir al home
        </button>
        </>
    );
}

export default Init;