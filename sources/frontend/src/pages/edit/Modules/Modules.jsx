import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { getModules, handleCreateModule } from '@/services/content.js'
import { PATHS } from '@/routes/paths.js'

import Form from '@/components/forms/Form/Form.jsx'
import Input from '@/components/forms/Input/Input.jsx'
import CardEdit from '@/components/containers/cardEdit/CardEdit.jsx'
import Button from '@/components/common/Button/button.jsx'

function Modules({courseId})
{
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const [newModule, setNewModule] = useState(false);

    const fetchModules = async () =>
    {
        const data = await getModules();
        if (Array.isArray(data)) setModules(data);
    };

    useEffect(() =>
    {
        fetchModules();
    }, []);

    const closeForm = () => setNewModule(false);
    const goTo = (id) => { navigate(`${PATHS.EDIT.MODULE}/${id}`); };

    const getUserId = () =>
    {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString).id : null;
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
                
        const creatorId = getUserId() || 1;
        const moduleName = data.module;

        if (!moduleName) {
            console.error("Error: el nombre del curso está vacío");
            return;
        }

        const isSuccess = await handleCreateModule(data, creatorId);

        if (isSuccess)
        {
            await fetchModules();
            setNewModule(false);
        }
    };

    return (
        <>
        {!newModule && (
        <section className="edit-container">
            <div>
                <Link to={PATHS.EDIT.COURSE}>{t('return')}</Link>
                <h2>{t('edit.module')}</h2>
                <h2>{courseId}</h2>
                <hr /> 
            </div>

            <div className='cards-grid'>
                <CardEdit
                    name='New module'
                    onClick={() => setNewModule(true)}
                    className='card-new'    
                />

                {modules.map((module) => (
                <CardEdit
                    key={module.id}
                    name={module.name}
                    onClick={() => goTo(module.name)}
                    className='card-edit'
                />
                ))}
            </div>
        </section>
        )}

        {newModule && (
        <section id='section-form'>
            <form id='form' onSubmit={handleSubmit}>
                <Input name='module' label={t('edit.create_module')} />

                <div id='form-btn-container'>
                    <Button className="btn btn-secondary" onClick={closeForm}>
                        {t('form.cancel')}
                    </Button>
                    <Button className="btn btn-primary" type="submit">
                        {t('form.send')}
                    </Button>
                </div>
            </form>
        </section>
        )}
       </>
    );
}

export default Modules