const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('logs', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    level: {
      type: DataTypes.STRING(10),
      comment: '상태',
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(2000),
      comment: '메시지',
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      comment: '생성시간'
    }
  }, {
    sequelize,
    tableName: 'logs',
    hasTrigger: true,
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' },
        ]
      },
    ]
  });
};
