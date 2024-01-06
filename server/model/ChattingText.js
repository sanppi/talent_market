function ChattingText(sequelize, DataTypes){
    return sequelize.define(
        'ChattingText', {
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
          memberId: {
            type: DataTypes.INTEGER,
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
          tableName: 'ChattingText',
          freezeTableName: true,
          timestamps: true,
        }
    )
}

module.exports = ChattingText;