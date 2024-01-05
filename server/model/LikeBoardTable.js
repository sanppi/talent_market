function LikeBoardTable(sequelize, DataTypes){
    return sequelize.define(
        'LikeBoardTable', {
            likeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
              },
              memberId: {
                type: DataTypes.INTEGER,
                allowNull: false
              },
              boardId: {
                type: DataTypes.INTEGER,
                allowNull: false
              },
              isLike: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: "false",
              },
            }, {
              tableName: 'LikeBoardTable',
            freezeTableName: true,
            timestamps: false,
        }
    )
}

module.exports = LikeBoardTable;