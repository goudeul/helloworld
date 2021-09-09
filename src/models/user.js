module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.STRING(100),
      comment: '아이디',
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      comment: '성명',
      allowNull: false,
    },
    role: {
      type: DataTypes.CHAR(2),
      comment: '권한 00:관리자, 10:교수, 20:학생',
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(128),
      comment: '전화번호',
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      comment: '암호',
      allowNull: false,
    },
    identityNumber: {
      type: DataTypes.STRING(128),
      comment: '학번',
      allowNull: true,
    },
    lastApiRequest: {
      type: DataTypes.DATE,
      comment: '마지막 접근시간',
      allowNull: false,
      defaultValue: sequelize.fn('NOW'),
    },
    lastModifyPassword: {
      type: DataTypes.DATE,
      comment: '마지막 암호변경시간',
      allowNull: false,
      defaultValue: sequelize.fn('NOW'),
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
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      comment: '생성시간',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
      comment: '수정시간',
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
        ],
      },
    ],
  })
}
