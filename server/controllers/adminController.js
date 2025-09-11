const db = require('../db');
const bcrypt = require('bcryptjs');

exports.addUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;

   
    const validRoles = ['System Administrator', 'Normal User', 'Store Owner'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid user role specified.' });
    }

    try {
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [name, email, hashedPassword, address, role]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.addStore = async (req, res) => {
    const { name, address, owner_id } = req.body;

    if (!name || !address || !owner_id) {
        return res.status(400).json({ message: 'Please provide name, address, and owner_id' });
    }
    
    try {
       
        const owner = await db.query("SELECT role FROM users WHERE id = $1 AND role = 'Store Owner'", [owner_id]);
        if (owner.rows.length === 0) {
            return res.status(400).json({ message: 'Provided owner_id is not a valid Store Owner.' });
        }

        const newStore = await db.query(
            'INSERT INTO stores (name, address, owner_id) VALUES ($1, $2, $3) RETURNING *',
            [name, address, owner_id]
        );
        res.status(201).json(newStore.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getDashboardStats = async (req, res) => {
    try {
        const userCount = await db.query('SELECT COUNT(*) FROM users');
        const storeCount = await db.query('SELECT COUNT(*) FROM stores');
        const ratingCount = await db.query('SELECT COUNT(*) FROM ratings');

        res.json({
            totalUsers: parseInt(userCount.rows[0].count),
            totalStores: parseInt(storeCount.rows[0].count),
            totalRatings: parseInt(ratingCount.rows[0].count),
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getUsers = async (req, res) => {
    
    try {
        const users = await db.query('SELECT id, name, email, address, role FROM users');
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getStores = async (req, res) => {
     
    try {
        const stores = await db.query(`
            SELECT 
                s.id, 
                s.name, 
                s.address, 
                u.email as owner_email,
                COALESCE(AVG(r.rating), 0) as average_rating
            FROM stores s
            LEFT JOIN users u ON s.owner_id = u.id
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id, u.email
        `);
        res.json(stores.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};