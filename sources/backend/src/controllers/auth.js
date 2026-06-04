const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { generateToken } = require('../config/jwt');


/* 8 -> min, may, num */
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userRegex = /^(?![0-9])[a-zA-Z0-9-_]{1,50}$/;

const login = async (req, res) =>
{
    const { email, pass, remember } = req.body;

    /* Basic validations */
    if (!email || !pass)
        return res.status(400).json({message: "Campos vacios"});

    if (!emailRegex.test(email)) 
        return res.status(400).json({ message: "Formato de email inválido." });
    
    if (pass !== 'admin' && !passRegex.test(pass)) 
        return res.status(400).json({ message: "La contraseña no cumple los requisitos." });

    try
    {
        /* Get user */
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        /* User exists */
        if (result.rows.length === 0)
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });

        const user = result.rows[0];

        /* Check account status */
        if (!user.active)
            return res.status(403).json({ message: "Cuenta no activada. Por favor, revise su correo." });

        /* Check pass */
        const isMatch = await bcrypt.compare(pass, user.password_hash);
        if (!isMatch)
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });

        /* Generate token */
        const token = generateToken(user, remember);

        return res.status(200).json({ 
            message: "Conectado correctamente", 
            token: token
        });
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

const signin = async (req, res) =>
{
    const { user, email, pass, rep, terms } = req.body;

    if (!user || !email || !pass || !rep)
        return res.status(400).json({ message: "Campos vacíos" });

    if (!userRegex.test(user))
        return res.status(400).json({ message: "Formato de usuario incorrecto" });
    
    if (!emailRegex.test(email)) 
        return res.status(400).json({ message: "Formato de email inválido" });
    
    if (pass !== 'admin' && !passRegex.test(pass)) 
        return res.status(400).json({ message: "Contraseña no cumple requisitos" });
    
    if (pass !== rep)
        return res.status(400).json({ message: "Las contraseñas no coinciden" });
    
    if (!terms)
        return res.status(400).json({ message: "Debes aceptar los términos" });

    try
    {
        const result = await pool.query('SELECT username, email from users WHERE username = $1 OR email = $2', [user, email]);

        if (result.rows.length > 0)
            return res.status(409).json({ message: "El usuario o el email ya están registrados." });

        const hash = await bcrypt.hash(pass, 10);

        await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', [user, email, hash]);

        return res.status(201).json({ message: "Usuario registrado con éxito." });
    }
    catch (error)
    {
        return res.status(500).json({message: "Internal error"});
    }
};

module.exports = { login, signin };