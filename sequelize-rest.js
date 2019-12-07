const Sequelize = require("sequelize");
const express = require("express");
const bodyparser = require("body-parser");

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:yn9hrm8uuwt949@localhost:5432/postgres";
const db = new Sequelize(databaseUrl);

const Movie = db.define("movie", {
  title: Sequelize.STRING,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.STRING
});

db.sync()
  .then(console.log("Database is synced"))
  .then(createInitialData())
  .catch(console.error);

function createInitialData() {
  Movie.findAll()
    .then(data => {
      data.length === 0 &&
        Promise.all([
          Movie.create({
            title: "Movie 1",
            yearOfRelease: "1998",
            synopsis: "Synopsis 1"
          }),
          Movie.create({
            title: "Movie 2",
            yearOfRelease: "1999",
            synopsis: "Synopsis 2"
          }),
          Movie.create({
            title: "Movie 3",
            yearOfRelease: "2019",
            synopsis: "Synopsis 3"
          })
        ]);
    })
    .catch(console.error);
}

const app = express();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on ${port}`));

const bodyparserMiddleware = bodyparser.json();
app.use(bodyparserMiddleware);

//create a new movie resource
app.post("/movie", (req, res, next) => {
  Movie.create(req.body)
    .then(movie => res.send(movie))
    .catch(error => next(error));
});

// read all movies (the collections resource)
app.get("/movie", (req, res, next) => {
  const limit = Math.min(req.query.limit || 25, 500);
  const offset = req.query.offset || 0;
  Movie.findAndCountAll({ limit, offset })
    .then(result => res.send({ data: result.rows, total: result.count }))
    .catch(next);
});

// read a single movie resource
app.get("/movie/:id", (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      movie
        ? res.send(movie)
        : res.status(404).send({ message: "id not found" });
    })
    .catch(next);
});
// update a single movie resource
app.patch("/movie/:id", (req, res, next) => {
  const upd = req.body;
  Movie.update(upd, { where: { id: req.params.id } })
    .then(number => {
      number[0]
        ? res.send({ message: `movie ${req.params.id} updated` })
        : res.status(404).send({ message: "id not found" });
    })
    .catch(next);
});
// delete a single movie resource
app.delete("/movie/:id", (req, res, next) => {
  Movie.destroy({ where: { id: req.params.id } })
    .then(number => {
      number
        ? res.send({ message: `movie ${req.params.id} deleted` })
        : res.status(404).send({ message: "id not found" });
    })
    .catch(next);
});
