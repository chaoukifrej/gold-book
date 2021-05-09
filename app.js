const express = require("express");
const app = express();
const mongoose = require("mongoose");

let bodyParser = require("body-parser");
let session = require("express-session");

//Moteur de template
app.set("view engine", "ejs");
//---------------------------------------------

//Middleware
app.use("/assets", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "zerttjgfd",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(require("./middlewares/flash.js"));
//---------------------------------------------

//Database mongodb
const uri =
  "mongodb+srv://chaouki:chaouki@demo.cwxqo.mongodb.net/demo?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connecté à MongoDB avec Mongoose");
  //console.log(db);
});
//---------------------------------------------

//Routes
app.get("/", async (req, res) => {
  const Message = require("./models/message");
  const messages = await Message.find({});
  try {
    res.render("index", { messages: messages });
  } catch (error) {
    req.flash(
      "error",
      "Une erreur est survenue lors de la lecture des messages"
    );
    res.render("index");
  }
});

app.post("/", async (req, res) => {
  if (req.body.message === undefined || req.body.message === "") {
    req.flash("error", "Vous n'avez pas entrer de message");
    res.redirect("/");
  } else {
    const Message = require("./models/message");
    const message = new Message({ content: req.body.message });
    try {
      await message.save();
      console.log(message);
      req.flash("success", "Message enregistré !");
      res.redirect("/");
    } catch (error) {
      req.flash("error", "Une erreur est survenue lors de l'enregistrement");
      res.redirect("/");
    }
  }
});
//---------------------------------------------

//serveur sur port 3000
app.listen(3000);
