console.clear();

require("./config/mongoConnection");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const configRoutes = require("./routes");
const firebase = require("./middlewares/firebase");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use("/firebaseTest", firebase.decodeToken);

app.use("*", async (req, res, next) => {
  let date = new Date().toUTCString();
  let reqmethod = req.method;
  let reqroute = req.originalUrl;
  let message = `[${date}]: ${reqmethod} ${reqroute}`;
  console.log(message);
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

configRoutes(app);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
}

app.listen(process.env.PORT, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on PORT ${process.env.PORT}`);
});
