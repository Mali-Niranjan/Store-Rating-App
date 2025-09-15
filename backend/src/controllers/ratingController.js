const { Rating, Store } = require('../models');

// submit or update rating
const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    if (!storeId || !rating) return res.status(400).json({ message: 'storeId and rating required' });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Invalid rating' });
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    const [record, created] = await Rating.upsert({
      storeId,
      userId: req.user.id,
      rating
    }, { returning: true });
    res.json({ rating: record, created });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get ratings for a store (admin or owner)
const getStoreRatings = async (req, res) => {
  try {
    const storeId = req.params.id;
    const ratings = await Rating.findAll({ where: { storeId } });
    res.json(ratings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { submitRating, getStoreRatings };
