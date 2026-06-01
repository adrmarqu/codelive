api.get('/api/me', (req, res) =>
{
    if (req.session && req.session.user)
    {
        return res.json({
            username: req.session.user.id,
            username: req.session.user.username,
            username: req.session.user.email,
            role: req.session.user.role,
        });
    }

    return res.status(401).json({message: "No authenticated"});
});