const { sequelize, DataTypes } = require("../lib/index");

const Genre = sequelize.define("Genre", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = { Genre };