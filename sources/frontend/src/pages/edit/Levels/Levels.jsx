import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

import Button from '@/components/Common/Button/Button.jsx'
import ElementLevel from '@/components/Containers/Element/ElementLevel.jsx'

import { 
    getCourseRequest,
    getModuleRequest, 
    getAllLevelsRequest, 
    postLevelRequest, 
    putLevelRequest,
    swapLevelRequest,
    deleteLevelRequest
} from '@/services/edit.js'

const Levels = () =>
{
    const { t } = useTranslation();
    const { course, module } = useParams();

    const navigate = useNavigate();

    const [newLevel, setNewLevel] = useState(false); // Form state
    const [levels, setLevel] = useState([]); // Levels list
    const [levelType, setLevelType] = useState("theory");
    const [courseId, setCourseId] = useState(null);
    const [moduleId, setModuleId] = useState(null);

    useEffect(() =>
    {
        const init = async () =>
        {
            try
            {
                const res = await getCourseRequest(course);
                
                if (res && res.data)
                {
                    setCourseId(res.data.id);

                    const response = await getModuleRequest(courseId, module);
                    if (response && response.data) setModuleId(response.data.id);
                }
            } 
            catch (error) { console.error("Error al obtener el módulo:", error); }
        };
        init();
    }, [module, course]);

    const fetchLevels = async () =>
    {
        try
        {
            const response = await getAllLevelsRequest(moduleId);
            const sorted = response.data.sort((a, b) => a.level - b.level);
            setLevels(sorted);
        }
        catch (error) { console.error("Error al cargar niveles:", error); }
    };

    useEffect(() =>
    {
        if (moduleId) fetchLevels();
    }, [moduleId]);

    const createLevel = async (e) =>
    {
        e.preventDefault();
        if (!moduleId) return ;

        console.log("New level:", levels.length + 1);

        try 
        {
            await postLevelRequest(moduleId, levels.length + 1, levelType);
            setLevelType("theory");
            setNewLevel(false);
            await fetchLevels();
        }
        catch (error) { console.error("Error al crear:", error); }
    };

    const handleUpdate = (id, level, newLevel, newType) =>
    {
        try
        {
            if (newLevel > levels.length)
                newLevel = levels.length;
            
            await putLevelRequest(moduleId, id, level, newLevel, newType); 
            await fetchLevels();
        } 
        catch (error) 
        {
            console.error("Error al eliminar nivel:", error);
        }
    };

    const handleMove = async (id, direction) =>
    {
        try
        {
            await swapLevelRequest(moduleId, id, direction); 
            await fetchLevels();
        } 
        catch (error) 
        {
            console.error("Error al mover nivel:", error);
        }
    };

    const handleDelete = (id) =>
    {
        try
        {
            await deleteLevelRequest(id); 
            await fetchLevels();
        } 
        catch (error) 
        {
            console.error("Error al eliminar nivel:", error);
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
                <select onChange={(e) => setLevelType(e.target.value)}>
                    <option value="theory">{t('edit.theory')}</option>
                    <option value="game">{t('edit.game')}</option>
                </select>
                <Button className="btn btn-primary" type="submit">
                    {t('create')}
                </Button>
            </form>

            {levels && levels.map((lvl) => (
                <Element 
                    key={lvl.id}
                    lvl={lvl.level}
                    lvlType={lvl.type}
                    onSave={(newL, newT) => handleUpdate(lvl.id,lvl.level,newL,newT)}
                    onDel={() => handleDelete(lvl.id)}
                    onUp={() => handleMove(lvl.id, 'up')}
                    onDown={() => handleMove(lvl.id, 'down')}
                    onNavigate={() => navigate(`/edit/courses/${course}/${module}/${lvl.name}`)}
                />
            ))}
        </div>
        </>
    );
};

const Levels = () =>
{
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { course, module } = useParams();

    const [courseId, setCourseId] = useState(null);
    const [moduleId, setModuleId] = useState(null);
    const [levels, setLevels] = useState([]);
    const [newLevel, setNewLevel] = useState(false);
    const [levelType, setLevelType] = useState("");
    const [levelOrder, setLevelOrder] = useState("");

    useEffect(() =>
    {
        const init = async () =>
        {
            try
            {
                const res = await getCourseRequest(course);
                
                if (res && res.data)
                {
                    setCourseId(res.data.id);

                    const response = await getModuleRequest(courseId, module);
                    if (response && response.data) setModuleId(response.data.id);
                }
            } 
            catch (error) { console.error("Error al obtener el módulo:", error); }
        };
        init();
    }, [module, course]);

    const fetchLevels = async () =>
    {
        try
        {
            const response = await getAllLevelsRequest(moduleId);
            const sorted = response.data.sort((a, b) => a.level - b.level);
            setLevels(sorted);
        }
        catch (error) { console.error("Error al cargar niveles:", error); }
    };

    useEffect(() =>
    {
        if (moduleId) fetchLevels();
    }, [moduleId]);

    const createLevel = async (e) =>
    {
        e.preventDefault();
        if (!levelType || !levelOrder) return;

        try
        {
            // Nota: Aquí pasas el moduleId, el nombre y el número de nivel
            await postLevelRequest(moduleId, levelOrder, type);
            setLevelType('');
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
                <input type="text" placeholder={t('level_type')} value={levelType} onChange={(e) => setName(e.target.value)} />
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