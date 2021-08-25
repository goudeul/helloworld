const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('simulation', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
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
      type: DataTypes.TEXT,
      comment: '모델 상태정보',
      allowNull: false,
      defaultValue: {
        position: {x: 37, y: 100, z: 3},
        rotation: {x: 37, y: 100, z: 3},
        scale: {x: 37, y: 100, z: 3},
      },
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
    camera: {
      type: DataTypes.TEXT,
      comment: '카메라 상태정보',
      allowNull: false,
      defaultValue: {
        position: {x: 37, y: 100, z: 3},
        rotation: {x: 37, y: 100, z: 3},
      },
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
    button: {
      type: DataTypes.TEXT,
      comment: '버튼정보모음',
      allowNull: false,
      defaultValue: {
        isRun: true, isInner: true, isFX: false,
        btnStatusGT: '0', btnStatusDE: '0', btnStatusRG: '0', btnStatusSP: '0',
      },
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
    parts: {
      type: DataTypes.TEXT,
      comment: '파츠 컨트롤 상태정보',
      allowNull: false,
      defaultValue: {
        isDiagramGT: false, isDiagramDE: false, diagramSpeed: 'normal', diagramStopTime: 0
      },
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
        ]
      },
    ]
  });
};
