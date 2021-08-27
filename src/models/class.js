const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('class', {
    // id: {
    //   autoIncrement: true,
    //   type: DataTypes.INTEGER.UNSIGNED,
    //   allowNull: false,
    //   primaryKey: true
    // },
    id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      comment: '이름',
      allowNull: false,
    },
    lastApiRequest: {
      type: DataTypes.DATE,
      comment: '마지막 접근시간',
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    professor: {
      type: DataTypes.JSON,
      comment: '교수정보',
      allowNull: true,
      defaultValue: {id: '', name: '', role: ''},
    },
    students: {
      type: DataTypes.JSON,
      comment: '학생정보',
      allowNull: true,
      defaultValue: [],
    },
    created_at: {
      type: DataTypes.DATE,
      comment: '생성시간',
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      comment: '수정시간',
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    sequelize,
    tableName: 'class',
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
