import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

import Button from '@/components/Common/Button/Button.jsx'
import Element from '@/components/Containers/Element/Element.jsx'

import { 
    getModuleRequest, 
    getAllLevelsRequest, 
    postLevelRequest, 
    putLevelRequest, 
    deleteLevelRequest 
} from '@/services/edit.js'

const Levels = () =>
{
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { course, module } = useParams();

    const [moduleId, setModuleId] = useState(null);
    const [levels, setLevels] = useState([]);
    const [newLevel, setNewLevel] = useState(false);
    const [name, setName] = useState("");
    const [levelOrder, setLevelOrder] = useState("");

    useEffect(() =>
    {
        const init = async () =>
        {
            try
            {
                const response = await getModuleRequest(course, module);
                if (response && response.data) setModuleId(response.data.id);
            } 
            catch (error) { console.error("Error al obtener el módulo:", error); }
        };
        init();
    }, [module, course]);

    useEffect(() =>
    {
        if (moduleId) fetchLevels(moduleId);
    }, [moduleId]);

    const fetchLevels = async () =>
    {
        try
        {
            const response = await getAllLevelsRequest(moduleId);
            // Ordenamos los niveles por el campo 'level' antes de guardarlos
            const sorted = response.data.sort((a, b) => a.level - b.level);
            setLevels(sorted);
        }
        catch (error) { console.error("Error al cargar niveles:", error); }
    };

    const createLevel = async (e) =>
    {
        e.preventDefault();
        if (!name || !levelOrder) return;

        try
        {
            // Nota: Aquí pasas el moduleId, el nombre y el número de nivel
            await postLevelRequest(moduleId, name, levelOrder);
            setName('');
            setLevelOrder('');
            setNewLevel(false);
            await fetchLevels();
        } 
        catch (error) { console.error("Error al crear:", error); }
    };

    const handleMove = async (id, direction) =>
    {
        try
        {
            await moveLevelRequest(moduleId, id, direction); 
            await fetchLevels();
        } 
        catch (error) 
        {
            console.error("Error al mover nivel:", error);
        }
    };

    return (
        <>
        <div className='edit-header'>
            <Button className="btn btn-secondary" onClick={() => navigate(-1)}>{t('return')}</Button>
            <h2>{module}</h2>
            <Button className="btn btn-primary" onClick={() => setNewLevel(true)}>{t('form.new')}</Button>
        </div>
        <hr />
        <div className='edit-content'>
            <form onSubmit={createLevel} className={newLevel ? '' : 'hidden'}>
                <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="number" placeholder="Nivel (ej: 1)" value={levelOrder} onChange={(e) => setLevelOrder(e.target.value)} />
                <button type='submit'>{t('create')}</button>
            </form>

            {levels && levels.map((lvl) => (
                <Element 
                    key={lvl.id}
                    title={`${lvl.level}. ${lvl.name}`} // Mostramos "1. Nombre"
                    onSave={(newName) => handleUpdate(lvl.id, newName)}
                    onDel={() => handleDelete(lvl.id)}
                    onNavigate={() => navigate(`/edit/courses/${course}/${module}/${lvl.name}`)}
                    onUp={() => handleMove(lvl.id, 'up')}
                    onDown={() => handleMove(lvl.id, 'down')}
                />
            ))}
        </div>
        </>
    );
};

export default Levels