import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { PATHS } from '@/routes/paths'

import Form from '@/components/Forms/Form/Form.jsx'
import Input from '@/components/Forms/Input/Input.jsx'

import './Verify.css'

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