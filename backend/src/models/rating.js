module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    storeId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } }
  }, {
    tableName: 'ratings',
    indexes: [
      { unique: true, fields: ['storeId', 'userId'] } // one rating per user per store
    ]
  });

  return Rating;
};
