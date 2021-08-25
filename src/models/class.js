const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('class', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
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
      type: DataTypes.TEXT,
      comment: '교수정보',
      allowNull: false,
      defaultValue: {id: '', name: '', role: ''},
      get() {
        try {
          return JSON.parse(this.getDataValue('value'));
        } catch (e) { return null; }
      },
      set(value) {
        if (!(value instanceof Object)) {
          throw Error('`value` should be an instance of Object');
        }
        this.setDataValue('value', JSON.stringify(value));
      },
    },
    students: {
      type: DataTypes.TEXT,
      comment: '학생정보',
      allowNull: false,
      defaultValue: [],
      get() {
        try {
          return JSON.parse(this.getDataValue('value'));
        } catch (e) { return null; }
      },
      set(value) {
        if (!(value instanceof Object)) {
          throw Error('`value` should be an instance of Object');
        }
        this.setDataValue('value', JSON.stringify(value));
      },
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
