function ChattingtText(sequelize, DataTypes){
    return sequelize.define(
        'ChattingtText', {
          chatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          roomId: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          createDate: {
            type: DataTypes.DATE,
            allowNull: false
          },
          chatText: {
            type: DataTypes.TEXT,
            allowNull: true
          }
        }, {
          tableName: 'ChattingtText',
            freezeTableName: true,
            timestamps: false,
        }
    )
}

module.exports = ChattingtText;