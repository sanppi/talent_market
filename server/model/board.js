function Board(sequelize, DataTypes) {
  return sequelize.define(
    "Board",
    {
      boardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      memberId: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
      image: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      isOnMarket: {
        type: DataTypes.ENUM("sale", "stop", "ends"),
        allowNull: false,
        defaultValue: "sale",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      likeNum: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      starAvg: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      tableName: "Board",
      freezeTableName: true,
      timestamps: true,
    }
  );
}

module.exports = Board;
