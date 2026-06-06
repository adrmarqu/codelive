import { useState } from 'react';

import './Form.css'

const FormEdit = ({ onClose, initialData, onSubmit }) =>
{
    const [formData, setFormData] = useState(initialData || { name: '', level: '' });

    const handleSubmit = (e) =>
    {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>{initialData ? 'Editar Elemento' : 'Nuevo Elemento'}</h3>
            
            <input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Nombre"
                required
            />
            
            {/* Si necesitas más campos, los añades aquí siguiendo el mismo patrón */}

            <button type="submit">{initialData ? 'Guardar Cambios' : 'Crear'}</button>
            <button type="button" onClick={onClose}>Cancelar</button>
        </form>
    );
};

export default FormEdit