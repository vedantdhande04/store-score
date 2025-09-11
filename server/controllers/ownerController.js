const db = require('../db');


exports.getDashboardData = async (req, res) => {
    const ownerId = req.user.id; 
    try {
        
        const storeResult = await db.query('SELECT id FROM stores WHERE owner_id = $1', [ownerId]);

        if (storeResult.rows.length === 0) {
            return res.status(404).json({ message: "You do not own a store." });
        }
        const storeId = storeResult.rows[0].id;

        
        const avgRatingResult = await db.query(
            'SELECT COALESCE(AVG(rating), 0) AS "averageRating" FROM ratings WHERE store_id = $1',
            [storeId]
        );
        const averageRating = parseFloat(avgRatingResult.rows[0].averageRating).toFixed(2);

        const ratersResult = await db.query(
    `SELECT u.name, u.email, r.rating, r.created_at, r.comment -- Add r.comment
     FROM ratings r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.store_id = $1 
     ORDER BY r.created_at DESC`,
    [storeId]
);
        res.json({
            storeId,
            averageRating,
            ratings: ratersResult.rows,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};