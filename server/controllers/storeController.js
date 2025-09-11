const db = require('../db');


exports.getStores = async (req, res) => {
    const userId = req.user.id;
    const { search } = req.query;

    try {
        let query = `
            SELECT 
                s.id, s.name, s.address,
                COALESCE(AVG(r.rating), 0) AS "overallRating",
                (SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id) AS "userSubmittedRating",
                (SELECT comment FROM ratings WHERE user_id = $1 AND store_id = s.id) AS "userSubmittedComment" -- Add this line
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
        `;

        const queryParams = [userId];

        if (search) {
            query += ` WHERE s.name ILIKE $2 OR s.address ILIKE $2`;
            queryParams.push(`%${search}%`);
        }

        query += ' GROUP BY s.id ORDER BY s.name';

        const { rows } = await db.query(query, queryParams);
        res.json(rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.rateStore = async (req, res) => {
    const { rating,comment } = req.body;
    const storeId = req.params.id;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
    const query = `
        INSERT INTO ratings (user_id, store_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, store_id)
        DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment
        RETURNING *;
    `;

    const { rows } = await db.query(query, [userId, storeId, rating, comment]); // <-- Add comment
    res.status(201).json({ message: 'Rating submitted successfully.', rating: rows[0] });

  }catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};