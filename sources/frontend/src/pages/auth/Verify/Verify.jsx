import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Form from '@/components/forms/Form/Form.jsx'
import Input from '@/components/forms/Input/Input.jsx'

import './Verify.css'

/* 

Como llegar

- Registrar una cuenta nueva en el signin

    - Llegara un codigo a tu correo, solo necesitas ponerlo para activar la cuenta

- He olvidado mi contraseña en login

    - Te pedira tu correo y enviara un codigo
    - Al poner el codigo te mandara a recuperar contraseña para poner tu nueva pass

- Actualizar email

    - te llegara un codigo a tu correo y deberas introducir ese codigo para cambiar tu email

*/

function Verify()
{
    const { t } = useTranslation();
    const { type } = useParams();

    const isPass = (type === 'password');

    const backend = `/api/auth/verify/${type}`;

    return (
        <Form name='verify.pass' action={backend}>
            {isPass && (
            <Input type="email" name="email" label={t('form.email')} />
            )}
            {!isPass && (
            <>
            <input id='n1' className='verify-input' type="number" maxLength={1} />
            </>
            )}
        </Form>
    );
}

export default Verify