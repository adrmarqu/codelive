import { Helmet } from 'react-helmet-async'

function Home()
{
    return (
        <>
        <Helmet>
            <title>CodeLive | Home</title>
        </Helmet>
        <div>
            <h1>Este es el home</h1>
        </div>
        </>
    );
}

export default Home;