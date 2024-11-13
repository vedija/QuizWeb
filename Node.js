app.get('/api/quiz', async (req, res) => {
    const subject = req.query.subject; // Retrieve the subject from query parameter
    if (!subject) {
        return res.status(400).json({ error: 'Subject is required' });
    }

    try {
        const questions = await db.query('SELECT * FROM questions WHERE subject = ?', [subject]);
        res.json({ questions });
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        res.status(500).json({ error: 'An error occurred while fetching quiz questions' });
    }
});
