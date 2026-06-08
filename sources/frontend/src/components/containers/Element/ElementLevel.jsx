import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@/components/Common/Button/Button.jsx'

import './Element.css'

const ElementLevel = ({ lvl, lvlType, onSave, onDel, onNavigate, onUp, onDown }) =>
{
    const [isEditing, setIsEditing] = useState(false);
    const [level, setLevel] = useState(lvl);
    const [tipo, setTipo] = useState(lvlType);

    const { t } = useTranslation();

    /* Save button */
    const handleSave = () =>
    {
        onSave(level, tipo);
        setIsEditing(false);
    };
    /* Cancel button */
    const handleCancel = () =>
    {
        setLevel(lvl);
        setTipo(lvlType);
        setIsEditing(false);
    };
    /* Edit button */
    const handleEdit = (e) => 
    {
        e.stopPropagation();
        setIsEditing(true);
    };   
    /* Delete button */   
    const handleDelete = (e) =>
    {
        e.stopPropagation();
        if (!window.confirm("Quieres borralo?")) return;
        onDel(lvl);
    };
    /* Up button */
    const handleUp = (e) =>
    {
        e.stopPropagation();
        onUp();
    };
    /* Down button */
    const handleDown = (e) =>
    {
        e.stopPropagation();
        onDown();
    };

    return (
        <>
            {isEditing ? (
                <div className='element-info'>
                    <input 
                        type="number"
                        value={lvl} 
                        onChange={(e) => setLevel(e.target.value)} 
                        autoFocus 
                    />
                    <select onChange={(e) => setTipo(e.target.value)}>
                        <option value="theory">{t('edit.theory')}</option>
                        <option value="game">{t('edit.game')}</option>
                    </select>
                    
                    <div className='element-btn'>
                        <Button className="btn btn-primary" onClick={handleSave}>
                            {t('form.save')}
                        </Button>
                        <Button className="btn btn-secondary" onClick={handleCancel}>
                            {t('form.cancel')}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className='element-info click' onClick={onNavigate}>
                    <h3>Level {lvl}</h3>
                    <h3>{lvlType}</h3>
                    <div className='element-btn'>
                        <Button className="btn btn-secondary" onClick={handleUp}>
                            ▲
                        </Button>
                        <Button className="btn btn-secondary" onClick={handleDown}>
                            ▼
                        </Button>
                        <Button className="btn btn-warning" onClick={handleEdit}>{t('form.edit')}</Button>
                        <Button className="btn btn-danger" onClick={handleDelete}>{t('form.delete')}</Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ElementLevel