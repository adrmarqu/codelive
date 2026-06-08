import { Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import './Terms.css'

const SECTIONS = [
    { h: '1. Aceptación de los términos', p: 'Al acceder y utilizar CodeLive aceptas estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no debes utilizar la plataforma.' },
    { h: '2. Descripción del servicio', p: 'CodeLive es una plataforma educativa interactiva para aprender programación (HTML, CSS, JavaScript, PHP, Node.js y SQL) mediante cursos, niveles prácticos y un editor de código en vivo. El contenido se ofrece con fines formativos.' },
    { h: '3. Cuentas de usuario', p: 'Eres responsable de mantener la confidencialidad de tu cuenta y contraseña, y de toda actividad que ocurra bajo ella. Debes proporcionar información veraz al registrarte y notificar cualquier uso no autorizado.' },
    { h: '4. Contenido y propiedad intelectual', p: 'Todos los cursos, textos, ejercicios y materiales son propiedad de CodeLive o de sus autores. No está permitido reproducir, distribuir ni explotar comercialmente el contenido sin autorización expresa.' },
    { h: '5. Conducta del usuario', p: 'Te comprometes a no utilizar la plataforma para fines ilícitos, ni a intentar vulnerar su seguridad, interferir en su funcionamiento o acceder a datos de otros usuarios.' },
    { h: '6. Privacidad de los datos', p: 'Tratamos tus datos personales con las medidas de seguridad adecuadas y únicamente para prestar y mejorar el servicio. No vendemos tu información a terceros.' },
    { h: '7. Limitación de responsabilidad', p: 'El servicio se ofrece "tal cual". CodeLive no garantiza que el contenido esté libre de errores ni se responsabiliza de daños derivados del uso de la plataforma.' },
    { h: '8. Modificaciones', p: 'Podemos actualizar estos términos en cualquier momento. Los cambios entran en vigor al publicarse en esta página, por lo que te recomendamos revisarla periódicamente.' },
    { h: '9. Contacto', p: 'Si tienes cualquier duda sobre estos términos, puedes escribirnos desde la página de Contacto disponible en el pie de la web.' }
];

function Terms()
{
    return (
        <main className="terms-page">
            <article className="terms-card">
                <Link to={PATHS.HOME} className="terms-brand" aria-label="CodeLive home">
                    <span className="terms-mark">&lt;/&gt;</span>
                    <span>Code<span className="terms-accent">Live</span></span>
                </Link>

                <h1>Términos y Condiciones de Servicio</h1>
                <p className="terms-updated">Última actualización: enero de 2026</p>

                <div className="terms-body">
                    {SECTIONS.map((s) => (
                        <section key={s.h}>
                            <h2>{s.h}</h2>
                            <p>{s.p}</p>
                        </section>
                    ))}
                </div>

                <Link to={PATHS.HOME} className="btn btn-primary terms-back">Volver a CodeLive</Link>
            </article>
        </main>
    );
}

export default Terms;
