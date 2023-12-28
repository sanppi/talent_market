function Member(sequelize, DataTypes) {
  return sequelize.define(
    "Member",
    {
      memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      id: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      pw: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      redCard: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      accountNum: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: "Member",
      freezeTableName: true,
      timestamps: false,
    }
  );
}

module.exports = Member;
