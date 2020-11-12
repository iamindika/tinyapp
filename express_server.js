const express = require("express");
const { generateRandomString, getUser } = require("./helper");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { response } = require("express");


//MIDDLE-WARE
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

//DATABASE
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5sk": "http://www.google.com"
};

const users = {

};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Create URLs
app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.cookies["user_id"]]};
  res.render("urls_new", templateVars);
});

// Display Data
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase, user: users[req.cookies["user_id"]]};
  res.render("urls_index", templateVars);
});



app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["user_id"]]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(`${longURL}`);
});



//"POST" Request Route Handlers

//Add a input checker for '/urls' ==> triggering generateRandomString for an empty input field on button click.  
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete(urlDatabase[shortURL]);
  res.redirect('/urls');
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const newLongURL = req.body.longURL;
  urlDatabase[shortURL] = newLongURL;
  res.redirect('/urls');
});

// LOGIN OPTIONS
app.get("/register", (req, res) => {
  res.render('user_register');
})

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || ! password) {
    res.statusCode = 400;
    return res.send('Error: Please enter an email and password!');
  } else if (getUser(users, email)) {
      res.statusCode = 400;
      return res.send('Error: Email already exists.  Please Sign in!');
  }
  const userId = generateRandomString();
  users[userId] = {
    id: userId, 
    email: req.body.email,
    password: req.body.password
  }
  res.cookie("user_id", userId);
  res.redirect('/urls');
})

app.get('/login', (req, res) => {
  res.render("user_login");
})

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = getUser(users, email);
  if (!userId) {
    response.statusCode = 403;
    return res.send('Error: Invalid email!');
  } else if (password !== users[userId].password) {
    response.statusCode = 403;
    return res.send('Error: Invalid password!');
  }
  res.cookie("user_id", userId);
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});