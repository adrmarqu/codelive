import './Input.css'

function Input({type = "text", name = "default", label = ""})
{
    return(
        <div className='form-container'>
            <label className='form-label' htmlFor={name}>{label}</label>
            <input className='form-input' type={type} name={name}/>
            <output></output>
        </div>
    );
}

export default Input