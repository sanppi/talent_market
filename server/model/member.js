function member(sequelize, DataTypes) {
    return sequelize.define(
        'member', {
            memberId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
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
                allowNull: false,
            },
            redCard: {
                type: DataTypes.INTEGER
            },
            accountNum: {
                type: DataTypes.STRING(30)
            }
        },{
            tableName: "member",
            freezeTableName: true,
            timestampes: false
        }
    )
}