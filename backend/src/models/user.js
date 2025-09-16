const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(400),
      },
      role: {
        type: DataTypes.ENUM("admin", "normal", "owner"),
        defaultValue: "normal",
      },
    },
    {
      tableName: "users",
      hooks: {
        beforeCreate: async (user) => {
          const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");
          user.password = await bcrypt.hash(user.password, saltRounds);
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");
            user.password = await bcrypt.hash(user.password, saltRounds);
          }
        },
      },
    }
  );

  // Instance method
  User.prototype.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
  };

  // ✅ Static helpers
  User.findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
  };

  User.createUser = async ({ name, email, password, role, address }) => {
    return await User.create({ name, email, password, role, address });
  };

  return User;
};
