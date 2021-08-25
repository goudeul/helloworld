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
    created_at: {
      type: DataTypes.DATE,
      comment: '생성시간',
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    sequelize,
    tableName: 'logs',
    hasTrigger: true,
    timestamps: true,
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
