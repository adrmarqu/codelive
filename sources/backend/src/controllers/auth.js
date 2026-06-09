const { generateToken } = require('../config/jwt');
const { getUserData, checkPass, userExists, setUser } = require('../models/user.js');
const { getCourse } = require('../models/courses.js');

/* 8 -> min, may, num <- 50 */
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/* letra - numero, letra, guion, min 2 - max 50 */
const userRegex = /^(?![0-9])[a-zA-Z0-9-_]{2,50}$/;

const login = async (req, res) =>
{
    const { email, pass, remember } = req.body;

    /* Basic validations */
    if (!email || !pass)
        return res.status(400).json({message: "Campos vacios"});

    if (!emailRegex.test(email)) 
        return res.status(400).json({ message: "Formato de email inválido." });
    
    if (!passRegex.test(pass)) 
        return res.status(400).json({ message: "La contraseña no cumple los requisitos." });

    try
    {
        const user = await getUserData(email);

        if (!user)
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });

        /* Check account status */
        /* if (!user.active)
            return res.status(403).json({ message: "Cuenta no activada. Por favor, revise su correo." }); */

        const isMatch = await checkPass(pass, user.password_hash);
        if (!isMatch)
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    
        /* Generate token */
        const token = generateToken(user, remember);

        return res.status(200).json({ 
            message: "Conectado correctamente", 
            token: token
        });
    }
    catch (error) {
        console.error("❌ ERROR REAL EN SIGNIN:", error); // <--- AÑADE ESTA LÍNEA AQUÍ
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
    
    if (!passRegex.test(pass)) 
        return res.status(400).json({ message: "Contraseña no cumple requisitos" });
    
    if (pass !== rep)
        return res.status(400).json({ message: "Las contraseñas no coinciden" });
    
    if (!terms)
        return res.status(400).json({ message: "Debes aceptar los términos" });

    try
    {
        if (await userExists(user, email))
            return res.status(409).json({ message: "El usuario o el email ya están registrados." });

        await setUser(user, email, pass);

        /* Enviar correo */

        return res.status(201).json({ message: "Usuario registrado con éxito." });
    }
    catch (error) {
        console.error("❌ ERROR REAL EN SIGNIN:", error); // <--- AÑADE ESTA LÍNEA AQUÍ
        return res.status(500).json({message: "Internal error"});
    }
};

module.exports = { login, signin };