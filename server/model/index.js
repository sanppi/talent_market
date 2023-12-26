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

module.exports = db;