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
          type: {
            type: DataTypes.STRING(10),
            allowNull: false
          },
          nickname: {
            type: DataTypes.STRING(20),
            allowNull: false
          },
          chatText: {
            type: DataTypes.TEXT,
            allowNull: false
          },
          createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
          updatedAt: {
              type: DataTypes.DATE,
              defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
              onUpdate: 'CURRENT_TIMESTAMP'
          }
        }, {
          tableName: 'ChattingtText',
          freezeTableName: true,
          timestamps: true,
        }
    )
}

module.exports = ChattingtText;