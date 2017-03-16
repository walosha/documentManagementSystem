'use strict';

module.exports = (sequelize, DataTypes) => {
  const Access = sequelize.define('Access', {
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    usersAccess: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    classMethod: {
      associate: (models) => {
        Access.belongsTo(models.Document, {
          onDelete: 'CASCADE',
          foreignKey: { allowNull: false }
        });
      }
    }

  });
  return Access;
};
