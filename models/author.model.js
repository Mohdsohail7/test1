const { sequelize, DataTypes } = require("../lib/index");

const Author = sequelize.define("Author", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthdate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },

});
module.exports = { Author };