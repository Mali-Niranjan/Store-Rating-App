const { User, Store, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');

// Admin: create a user (admin or normal or owner)
const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const exists = await User.findOne({ where: { email }});
    if (exists) return res.status(400).json({ message: 'Email exists' });
    const user = await User.create({ name, email, password, address, role: role || 'normal' });
    res.json({ user });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// List users with filter & sort
const listUsers = async (req, res) => {
  try {
    const { q, role, sortBy='name', order='ASC', page=1, limit=20 } = req.query;
    const where = {};
    if (role) where.role = role;
    if (q) where[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { email: { [Op.iLike]: `%${q}%` } },
      { address: { [Op.iLike]: `%${q}%` } }
    ];
    const users = await User.findAndCountAll({
      where,
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      attributes: ['id','name','email','address','role']
    });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// view user details
const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, { attributes: ['id','name','email','address','role']});
    if (!user) return res.status(404).json({ message: 'Not found' });
    // if store owner, include rating of their stores
    if (user.role === 'owner') {
      const stores = await Store.findAll({ where: { ownerId: id }, include: [{ model: Rating, as: 'ratings' }]});
      // compute store average
      const details = await Promise.all(stores.map(async s => {
        const avg = s.ratings.length ? (s.ratings.reduce((a,b)=>a+b.rating,0)/s.ratings.length).toFixed(2) : null;
        return { id: s.id, name: s.name, averageRating: avg };
      }));
      return res.json({ user, stores: details });
    }
    res.json({ user });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Update password (for logged-in user)
const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    req.user.password = password;
    await req.user.save();
    res.json({ message: 'Password updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createUserByAdmin, listUsers, getUser, updatePassword };
