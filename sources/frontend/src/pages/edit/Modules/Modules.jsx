import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

import Button from '@/components/common/Button/Button.jsx'
import Element from '@/components/containers/Element/Element.jsx'

import { getCourseRequest, getAllModulesRequest, postModuleRequest, putModuleRequest, deleteModuleRequest } from '@/services/edit.js'

const Modules = () =>
{
    const navigate = useNavigate();

    const { t } = useTranslation();
    const { course } = useParams();

    const [courseId, setCourseId] = useState(null);
    const [modules, setModules] = useState([]);
    const [newModule, setNewModule] = useState(false);
    const [name, setName] = useState("");

    useEffect(() =>
    {
        const init = async () =>
        {
            try
            {
                const response = await getCourseRequest(course);
                
                console.log("Respuesta completa de Axios:", response);
                
                if (response && response.data)
                {
                    console.log("ID encontrado:", response.data.id);
                    setCourseId(response.data.id);
                }
            }
            catch (error)
            {
                console.error("Error al obtener el curso:", error);
            }
        };

        init();
    }, [course]);

    const fetchModules = useCallback(async () =>
    {
        try
        {
            const response = await getAllModulesRequest(courseId);
            setModules(response.data);
        }
        catch (error)
        {
            console.error("Error al cargar los cursos:", error);
        }
    }, [courseId]);

    useEffect(() =>
    {
        if (courseId) fetchModules();
    }, [courseId, fetchModules]);

    const newElement = () => setNewModule(true);
    const cancelForm = () => 
    {
        setNewModule(false);
        setName("");
    }
    const createModule = async (e) =>
    {
        e.preventDefault();

        setName(name.trim());

        if (!name) return;

        try
        {
            console.log("NAME:", name, "ID:", courseId);
            const response = await postModuleRequest(courseId, name);
            
            console.log("Modulo creado:", response.data);
            
            setName('');
            cancelForm();
            
            await fetchModules();
        }
        catch (error)
        {
            console.error("Error al crear el modulo:", error);
        }
    };

    const handleUpdate = async (id, newName) =>
    {
        try
        {
            await putModuleRequest(id, newName);
            await fetchModules();
        }
        catch (error)
        {
            console.error("Error al editar:", error);
        }
    };

    const handleDelete = async (id) =>
    {
        try
        {
            console.log("Intentando borrar ID:", id);
            await deleteModuleRequest(id);
            await fetchModules();
        }
        catch (error)
        {
            console.error("Error al borrar:", error);
        }
    };

    return (
        <>
        <div className='edit-header'>
            <Button className="btn btn-secondary" onClick={() => navigate(-1)} >
                {t('return')}
            </Button>
            <h2>{course}</h2>
            <Button className="btn btn-primary" onClick={newElement}>
                {t('form.new')}
            </Button>
        </div>
        <hr />
        <div className='edit-content'>
            <form onSubmit={createModule} className={newModule ? '' : 'hidden'}>
                <input className='edit-input' type="text" placeholder={t('form.name')} value={name} onChange={(e) => setName(e.target.value)} />

                <button className='btn btn-secondary' type='button' onClick={cancelForm}>{t('cancel')}</button>
                <button className='btn btn-primary' type='submit'>{t('create')}</button>
            </form>

            {modules && modules.map((module) => (
                <Element 
                    key={module.id}
                    title={module.name}
                    onSave={(newName) => handleUpdate(module.id, newName)}
                    onDel={async () => handleDelete(module.id)}
                    onNavigate={() => navigate(`/edit/courses/${course}/${module.name}`)}
                />
            ))}
        </div>
        </>
    );
};

export default Modules