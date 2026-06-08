function Button(
{
    children,
    className = '',
    variant = '',
    onClick = () => {},
    type = "button",
    disabled = false
})
{
    return (
        <button
            className={`${className} ${variant}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {children}
        </button>
    );
}

export default Button