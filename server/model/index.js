const Sequelize = require("sequelize");
const config = require("../config/config.json")["development"];

const db = {};
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.member = require("./member")(sequelize, Sequelize);
db.board = require("./board")(sequelize, Sequelize);

db.member.hasMany(db.board, { foreignKey: 'writtenBy', sourceKey: 'memberId' });
db.board.belongsTo(db.member, { foreignKey: 'writtenBy', targetKey: 'memberId' });

db.member.hasMany(db.comment, { foreignKey: 'writtenBy', sourceKey: 'memberId' });
db.comment.belongsTo(db.member, { foreignKey: 'writtenBy', targetKey: 'memberId' });

db.board.hasMany(db.comment, { foreignKey: 'writtenAt', sourceKey: 'boardId' });
db.comment.belongsTo(db.board, { foreignKey: 'writtenAt', targetKey: 'boardId' });

module.exports = db;