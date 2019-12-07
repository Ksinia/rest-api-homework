const Sequelize = require("sequelize");
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:yn9hrm8uuwt949@localhost:5432/postgres";
const db = new Sequelize(databaseUrl);
db.sync()
  .then(console.log("Database is synced"))
  .catch(console.error);

const Movie = db.define("movie", {
  title: Sequelize.STRING,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.STRING
});
