const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/db"); // adjust path if different

class User extends Model {
  // 🔑 Compare entered password with hashed one
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("admin", "owner", "normal"),
      defaultValue: "normal",
    },
    address: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

// ✅ Hash password before saving a new user
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// ✅ Hash password when updating
User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

module.exports = User;
