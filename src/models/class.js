module.exports = function (sequelize, DataTypes) {
  return sequelize.define('class', {
    id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
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
      defaultValue: sequelize.fn('NOW')
    },
    professor: {
      type: DataTypes.JSON,
      comment: '교수정보',
      allowNull: true,
      defaultValue: { id: '', name: '', role: '' },
    },
    students: {
      type: DataTypes.JSON,
      comment: '학생정보',
      allowNull: true,
      defaultValue: [],
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      comment: '생성시간'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
      comment: '수정시간'
    }
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
        ],
      },
    ],
  })
}
