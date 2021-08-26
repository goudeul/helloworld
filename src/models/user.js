const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.STRING(100),
      comment: '아이디',
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      comment: '성명',
      allowNull: false,
    },
    role: {
      type: DataTypes.CHAR(2),
      comment: '권한 00:관리자, 10:교수, 20:학생',
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(16),
      comment: '전화번호',
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      comment: '암호',
      allowNull: false
    },
    identityNumber: {
      type: DataTypes.STRING(100),
      comment: '학번',
      allowNull: true,
    },
    lastApiRequest: {
      type: DataTypes.DATE,
      comment: '마지막 접근시간',
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    lastModifyPassword: {
      type: DataTypes.DATE,
      comment: '마지막 암호변경시간',
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    failLoginCount: {
      type: DataTypes.INTEGER,
      comment: '로그인 실패횟수',
      allowNull: false,
      defaultValue: 0,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      comment: '로그인 차단여부',
      allowNull: false,
      defaultValue: false,
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
    tableName: 'user',
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
