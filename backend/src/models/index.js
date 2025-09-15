const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Store = require('./store')(sequelize, Sequelize.DataTypes);
const Rating = require('./rating')(sequelize, Sequelize.DataTypes);

// Associations
User.hasMany(Store, { foreignKey: 'ownerId', as: 'stores' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

module.exports = { sequelize, User, Store, Rating };
