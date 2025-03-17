const { sequelize, DataTypes } = require("../lib/index");
const { Author } = require("./author.model");
const { Genre } = require("./genre.model");

const Book = sequelize.define("Book", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    publicationYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Author,
            key: "id"
        }
    }
});

// Associations
Book.belongsTo(Author, { foreignKey: {
    name: "authorId", allowNull: false
}});

Book.belongsToMany(Genre, { through: "BookGenres"});
Genre.belongsToMany(Book, { through: "BookGenres"});

module.exports = { Book };