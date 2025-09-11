const db = require('../db');
const bcrypt = require('bcryptjs');


exports.updatePassword = async (req, res) => {
    const { password } = req.body;
    const userId = req.user.id;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be 8-16 characters long, with at least one uppercase letter and one special character.' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};