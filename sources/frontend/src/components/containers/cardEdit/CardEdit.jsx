import './CardEdit.css'

function CardEdit({name, onClick, className})
{
    return(
        <div className={className} onClick={onClick}>
            {name}
        </div>
    );
}

export default CardEdit