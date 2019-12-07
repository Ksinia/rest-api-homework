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
  .catch(console.error)
  .then(createInitialData())
  .catch(console.error);

function createInitialData() {
  Movie.findAll().then(data => {
    data.length === 0 &&
      Movie.create({
        title: "Movie 1",
        yearOfRelease: "1998",
        synopsis: "Synopsis 1"
      }) &&
      Movie.create({
        title: "Movie 2",
        yearOfRelease: "1999",
        synopsis: "Synopsis 2"
      }) &&
      Movie.create({
        title: "Movie 3",
        yearOfRelease: "2019",
        synopsis: "Synopsis 3"
      });
  });
}

const app = express();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on ${port}`));

const bodyparserMiddleware = bodyparser();
app.use(bodyparserMiddleware);

//create a new movie resource
app.post("/movie", (req, res, next) => {
  Movie.create(req.body)
    .then(movie => {
      res.send(movie).catch(error => next(error));
    })
    .catch(error => next(error));
});

// read all movies (the collections resource)
app.get("/movie", (req, res, next) => {
  Movie.findAll()
    .then(movies => {
      res.send(movies).catch(next);
    })
    .catch(next);
});
// read a single movie resource
app.get("/movie/:id", (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      res.send(movie).catch(next);
    })
    .catch(next);
});
// update a single movie resource
app.put("/movie/:id", (req, res, next) => {
  const upd = req.body;
  const id = req.params.id;
  Movie.update(upd, { where: { id } })
    .then(data => {
      res.send(data).catch(next);
    })
    .catch(next);
});
// delete a single movie resource
