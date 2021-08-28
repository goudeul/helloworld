module.exports = function(sequelize, DataTypes) {
  return sequelize.define('simulation', {
    id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
    screenID: {
      type: DataTypes.STRING(2),
      comment: '화면번호, 기본값=01',
      allowNull: false,
      defaultValue: '01',
    },
    isSharing: {
      type: DataTypes.BOOLEAN,
      comment: '',
      allowNull: false,
      defaultValue: false,
    },
    modeling: {
      type: DataTypes.JSON,
      comment: '모델 상태정보',
      allowNull: true,
      defaultValue: {
        position: { x: 37, y: 100, z: 3 },
        rotation: { x: 37, y: 100, z: 3 },
        scale: { x: 37, y: 100, z: 3 },
      },
    },
    camera: {
      type: DataTypes.JSON,
      comment: '카메라 상태정보',
      allowNull: true,
      defaultValue: {
        position: { x: 37, y: 100, z: 3 },
        rotation: { x: 37, y: 100, z: 3 },
      },
    },
    button: {
      type: DataTypes.JSON,
      comment: '버튼정보모음',
      allowNull: true,
      defaultValue: {
        isRun: true,
        isInner: true,
        isFX: false,
        btnStatusGT: '0',
        btnStatusDE: '0',
        btnStatusRG: '0',
        btnStatusSP: '0',
      },
    },
    parts: {
      type: DataTypes.JSON,
      comment: '파츠 컨트롤 상태정보',
      allowNull: true,
      defaultValue: {
        isDiagramGT: false, isDiagramDE: false, diagramSpeed: 'normal', diagramStopTime: 0,
      },
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
    tableName: 'simulation',
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
