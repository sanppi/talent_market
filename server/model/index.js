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
db.Member = require("./Member")(sequelize, Sequelize);
db.Board = require("./Board")(sequelize, Sequelize);
db.Comment = require("./Comment")(sequelize, Sequelize);

db.Member.hasMany(db.Board, { foreignKey: 'writtenBy', sourceKey: 'memberId' });
db.Board.belongsTo(db.Member, { foreignKey: 'writtenBy', targetKey: 'memberId' });

db.Member.hasMany(db.Comment, { foreignKey: 'writtenBy', sourceKey: 'memberId' });
db.Comment.belongsTo(db.Member, { foreignKey: 'writtenBy', targetKey: 'memberId' });

db.Board.hasMany(db.Comment, { foreignKey: 'writtenAt', sourceKey: 'boardId' });
db.Comment.belongsTo(db.Board, { foreignKey: 'writtenAt', targetKey: 'boardId' });

module.exports = db;