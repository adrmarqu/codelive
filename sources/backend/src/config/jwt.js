/* Para manejar token y sessiones */

const jwt = require('jsonwebtoken');

const generateToken = (user, remember) =>
{
    console.log("DEBUG: JWT_SECRET es:", process.env.JWT_SECRET);

    const duration = remember ? '30d' : '1h';
    return jwt.sign(
    {
        id: user.id,
        rol: user.rol,
        username: user.username,
        email: user.email
    }, 
    process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) =>
{
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };