// const bcrypt = require('bcrypt');

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//     id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     name: { type: DataTypes.STRING(60), allowNull: false },
//     email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
//     password: { type: DataTypes.STRING(255), allowNull: false },
//     address: { type: DataTypes.STRING(400) },
//     role: { type: DataTypes.ENUM('admin', 'normal', 'owner'), defaultValue: 'normal' }
//   }, {
//     tableName: 'users',
//     hooks: {
//       beforeCreate: async (user) => {
//         const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
//         user.password = await bcrypt.hash(user.password, saltRounds);
//       },
//       beforeUpdate: async (user) => {
//         if (user.changed('password')) {
//           const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
//           user.password = await bcrypt.hash(user.password, saltRounds);
//         }
//       }
//     }
//   });

//   User.prototype.comparePassword = function (plain) {
//     return bcrypt.compare(plain, this.password);
//   };

//   return User;
// };

// const { DataTypes, Model } = require('sequelize');
// const bcrypt = require('bcrypt');
// const sequelize = require('../db'); // your Sequelize/DB connection

// class User extends Model {
//   async comparePassword(password) {
//     return await bcrypt.compare(password, this.password);
//   }
// }

// User.init({
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   name: { type: DataTypes.STRING, allowNull: false },
//   email: { type: DataTypes.STRING, allowNull: false, unique: true },
//   password: { type: DataTypes.STRING, allowNull: false },
//   role: { type: DataTypes.ENUM('admin','user','owner'), allowNull: false, defaultValue: 'user' },
//   address: { type: DataTypes.STRING }
// }, {
//   sequelize,
//   modelName: 'User',
//   tableName: 'users',
//   hooks: {
//     beforeCreate: async (user) => {
//       user.password = await bcrypt.hash(user.password, 10);
//     },
//     beforeUpdate: async (user) => {
//       if (user.changed('password')) {
//         user.password = await bcrypt.hash(user.password, 10);
//       }
//     }
//   }
// });

// module.exports = User;

const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../../db'); // your DB connection

class User extends Model {
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin','user','owner'), allowNull: false, defaultValue: 'user' },
  address: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => { user.password = await bcrypt.hash(user.password, 10); },
    beforeUpdate: async (user) => { if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10); }
  }
});

// Sync table
(async () => {
  await sequelize.sync();
  console.log("✅ User table synced");
})();

module.exports = User;
