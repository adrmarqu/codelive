import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

import Button from '@/components/common/Button/Button.jsx'
import ElementLevel from '@/components/containers/Element/ElementLevel.jsx' // 👈 Asegúrate de usar este nombre

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

    const [levels, setLevels] = useState([]); // 1. CORREGIDO: Ahora es setLevels (plural)
    const [moduleId, setModuleId] = useState(null);

    // 2. CORREGIDO: Evitar el desfase asíncrono usando variables locales intermedias
    useEffect(() => {
        const init = async () => {
            try {
                const res = await getCourseRequest(course);
                
                if (res && res.data) {
                    const fetchedCourseId = res.data.id;

                    // Usamos la variable local en lugar del estado desfasado
                    const response = await getModuleRequest(fetchedCourseId, module);
                    if (response && response.data) {
                        setModuleId(response.data.id);
                    }
                }
            } 
            catch (error) { 
                console.error("Error al obtener el módulo:", error); 
            }
        };
        init();
    }, [module, course]);

    const fetchLevels = useCallback(async () => {
        if (!moduleId) return; // Seguridad por si no hay módulo cargado
        try {
            const response = await getAllLevelsRequest(moduleId);
            if (response && response.data) {
                const sorted = response.data.sort((a, b) => a.level - b.level);
                setLevels(sorted); // Ahora sí llamará al set de arriba
            }
        }
        catch (error) { 
            console.error("Error al cargar niveles:", error); 
        }
    }, [moduleId]);

    useEffect(() => {
        if (moduleId) fetchLevels();
    }, [moduleId, fetchLevels]);

    const createLevel = async (e) =>
    {
        if (!moduleId) return;

        try {
            await postLevelRequest(moduleId);
            await fetchLevels();
        }
        catch (error) { 
            console.error("Error al crear:", error); 
        }
    };

    // 3. CORREGIDO: Añadida la palabra clave async
    const handleUpdate = async (id, level, newLevel) => {
        try
        {            
            await putLevelRequest(moduleId, id, level, newLevel); 
            await fetchLevels();
        } 
        catch (error) {
            console.error("Error al actualizar nivel:", error);
        }
    };

    const handleMove = async (id, direction) => {
        try {
            await swapLevelRequest(moduleId, id, direction); 
            await fetchLevels();
        } 
        catch (error) {
            console.error("Error al mover nivel:", error);
        }
    };

    // 4. CORREGIDO: Añadida la palabra clave async
    const handleDelete = async (id) => {
        try {
            await deleteLevelRequest(id); 
            await fetchLevels();
        } 
        catch (error) {
            console.error("Error al eliminar nivel:", error);
        }
    };

    return (
        <>
        <div className='edit-header'>
            <Button className="btn btn-secondary" onClick={() => navigate(-1)}>{t('return')}</Button>
            <h2>{module}</h2>
            <Button className="btn btn-primary" onClick={createLevel}>{t('form.new')}</Button>
        </div>
        <hr />
        <div className='edit-content'>
            {/* 5. CORREGIDO: Cambiado <Element> por <ElementLevel> que es tu componente real importado */}
            {levels && levels.map((lvl) => (
                <ElementLevel 
                    key={lvl.id}
                    lvl={lvl.level}
                    lvlName={lvl.title || t('no_content_title')}
                    onSave={(newLevel) => handleUpdate(lvl.id, lvl.level, newLevel)}
                    onDel={() => handleDelete(lvl.id)}
                    onUp={() => handleMove(lvl.id, 'up')}
                    onDown={() => handleMove(lvl.id, 'down')}
                    onNavigate={() => navigate(`/edit/courses/${course}/${module}/${lvl.level}`)}
                />
            ))}
        </div>
        </>
    );
};

export default Levels;