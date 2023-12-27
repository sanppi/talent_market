const http = require("http");
const express = require("express");
const app = express();
const PORT = 8000;
const server = http.createServer(app);

// const { member } = require("./model");
// const { board } = require("./model");
// const { comment } = require("./model");

const cors = require("cors");
const { emit } = require("process");
app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});


app.set("view engine", "ejs");
app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const router = require("./routes");
app.use("/", router);

app.get("*", function (req, res) {
  res.render("404");
});

app.listen(PORT, () => {
  console.log("Server Port : ", PORT);
});
