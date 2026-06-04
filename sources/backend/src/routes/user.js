/* profile, ranking, progress, contact, list, update  */

const express = require('express');
const router = express.Router();
const protect = require('../middleware/middleware');


router.get('/me', protect, (req, res) =>
{
    if (req.user)
    {
        return res.json(
        {
            id: req.user.id,
            username: req.user.username || 'Guest',
            email: req.user.email,
            rol: req.user.rol || 'guest'
        });
    }
    return res.json({ rol: 'guest' });
});

module.exports = router;