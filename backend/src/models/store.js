module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255) },
    address: { type: DataTypes.STRING(400) },
    ownerId: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'stores' });

  return Store;
};
