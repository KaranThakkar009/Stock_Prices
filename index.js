// Karan Thakkar[13-07-21] importing & initializing routes

const express = require("express");
const app = express();
const error = require("./middlewares/error");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const db = require("./db-init/dbConn");
const stockPriceRoute = require("./routes/api/stockPrice");
const loginRoute = require("./routes/api/login");
const signUpRoute = require("./routes/api/signUp");
const insights = require("./routes/api/insights");

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(logger("common"));

// write your routes below
app.use("/api/login/", loginRoute);
app.use("/api/signUp/", signUpRoute);
app.use("/api/stockPrice/", stockPriceRoute);
app.use("/api/", insights);
app.use(error);

const port = 5000;

if (process.env.NODE_ENV !== "test") {
  db.connect()
    .then((obj) => {
      app.locals.db = obj;
      obj.done(); // success, release connection;

      app.listen(port, () =>
        console.log(`Server is listening at http://localhost:${port}`)
      );
    })
    .catch((err) => {
      console.log("ERROR:", error.message);
    });
}

module.exports = app;
