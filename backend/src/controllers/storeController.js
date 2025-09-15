const { Store, Rating, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// Admin adds store
const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ name, email, address, ownerId });
    res.json({ store });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// list stores (search / sort / pagination)
// For normal users: show overall rating and my rating (if logged in)
const listStores = async (req, res) => {
  try {
    const { q, sortBy='name', order='ASC', page=1, limit=20 } = req.query;
    const where = {};
    if (q) where[Op.or] = [{ name: { [Op.iLike]: `%${q}%` } }, { address: { [Op.iLike]: `%${q}%` } }];
    // include ratings summary
    const stores = await Store.findAll({
      where,
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      include: [{ model: Rating, as: 'ratings' }]
    });

    const result = await Promise.all(stores.map(async s => {
      const avg = s.ratings.length ? (s.ratings.reduce((a,b)=>a+b.rating,0)/s.ratings.length).toFixed(2) : null;
      let myRating = null;
      if (req.user) {
        const my = s.ratings.find(r => r.userId === req.user.id);
        if (my) myRating = my.rating;
      }
      return {
        id: s.id, name: s.name, address: s.address, ownerId: s.ownerId,
        overallRating: avg, myRating
      };
    }));

    res.json({ data: result, count: result.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Owner: list users who rated their store, and average rating
const ownerStoreDetails = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const stores = await Store.findAll({ where: { ownerId }, include: [{ model: Rating, as: 'ratings', include: [{ model: User, as: 'user', attributes: ['id','name','email'] }] }]});
    const result = stores.map(s => {
      const avg = s.ratings.length ? (s.ratings.reduce((a,b)=>a+b.rating,0)/s.ratings.length).toFixed(2) : null;
      const users = s.ratings.map(r => ({ id: r.user.id, name: r.user.name, email: r.user.email, rating: r.rating }));
      return { storeId: s.id, storeName: s.name, avgRating: avg, users };
    });
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { addStore, listStores, ownerStoreDetails };
