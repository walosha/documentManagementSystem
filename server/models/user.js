'use strict';
import bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        min: 6
      }
    },
    roleId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }

  },
    {
      classMethods: {
        associate: (models) => {
          User.hasMany(models.Document, { foreignKey: 'ownerId' });
          User.belongsTo(models.Role, {
            onDelete: 'CASCADE',
            foreignKey: { allowNull: false }
          });
        }
      },
      instanceMethods: {
        toJson() {
          delete this.dataValues.password;
          return this.dataValues;
        }
      },
      hooks: {
        beforeCreate: (user) => {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        }
      }
    });

  return User;
};
