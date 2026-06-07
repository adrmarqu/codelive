import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@/components/Common/Button/Button.jsx'

import './Element.css'

const Element = ({ title, onSave, onDel, onNavigate }) =>
{
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(title);

    const { t } = useTranslation();

    const handleSave = () =>
    {
        onSave(name);
        setIsEditing(false);
    };
    const handleCancel = () =>
    {
        setName(title);
        setIsEditing(false);
    };
    const handleEdit = (e) => 
    {
        e.stopPropagation();
        setIsEditing(true);
    };      
    const handleDelete = (e) =>
    {
        e.stopPropagation();
        if (!window.confirm("Quieres borralo?")) return;
        onDel(title);
    };

    return (
        <>
            {isEditing ? (
                <div className='element-info'>
                    <input 
                        type={inputType} 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        autoFocus 
                    />
                    
                    <div className='element-btn'>
                        <Button className="btn btn-primary" onClick={handleSave}>{t('form.save')}</Button>
                        <Button className="btn btn-secondary" onClick={handleCancel}>{t('form.cancel')}</Button>
                    </div>
                </div>
            ) : (
                <div className='element-info click' onClick={onNavigate}>
                    <h3>{title}</h3>
                    <div className='element-btn'>
                        <Button className="btn btn-warning" onClick={handleEdit}>{t('form.edit')}</Button>
                        <Button className="btn btn-danger" onClick={handleDelete}>{t('form.delete')}</Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Element