const express = require("express");
const cookieParser = require("cookie-parser");

const generateRandomString = () => {
  let alphaNumStr = '';

  for (let i = 0; i < 6; i++) {
    let selection = Math.floor(Math.random() * 3);

    switch (selection) {
      case 0:
        alphaNumStr += String.fromCharCode(Math.floor(Math.random() * 10) + 48);
        break;
      case 1: 
        alphaNumStr += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        break;
      case 2:
        alphaNumStr += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        break;
      default:
        break;
    }
  }

  return alphaNumStr;
};

// MIDDLEWARE && SERVER SETUP
const app = express();
const PORT = 8080;
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// DATABASES
 const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
  };

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  }
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const { shortURL }= req.params;
  const templateVars = {
    username: req.cookies["username"],
    shortURL,
    longURL: urlDatabase[shortURL]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const { shortURL }= req.params;
  res.redirect(urlDatabase[shortURL]);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const { longURL } = req.body;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  res
    .cookie("username", username)
    .redirect("/urls");
});

app.post("/logout", (req, res) => {
  res
    .clearCookie("username")
    .redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies['username']
  }
  res.render("user_register", templateVars);
});