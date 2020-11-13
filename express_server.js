// IMPORTS
const express = require("express");
const { generateRandomString, getUserByEmail, urlsForUser } = require("./helpers");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const { response } = require("express");
const bcrypt = require('bcrypt');


// MIDDLEWARE && SERVER SETUP
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  secret:'notmycookies'
}));
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// DATABASES
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  aJ48lW: {
    id: 'aJ48lW',
    email: 'admin@myadmin.com',
    password: bcrypt.hashSync('1234', 10)   // Password visible for test purposes
  }
};


// DISPLAY ALL USER URLS
app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  const templateVars = {urls: urlsForUser(urlDatabase, userId), user: users[userId]};
  res.render("urls_index", templateVars);
});


// CREATE SHORT LINKS
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  }
  const templateVars = {user: users[req.session.user_id]};
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.session.user_id};
  res.redirect(`/urls/${shortURL}`);
});


// EDIT SHORT LINKS
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;
  const userUrls = urlsForUser(urlDatabase, userId);
  const templateVars = {shortURL, longURL: userUrls[shortURL], user: users[userId], urls: urlDatabase};
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.id;
  const newLongURL = req.body.longURL;
  if (userId) {
    let userURLs = urlsForUser(urlDatabase, userId);
    if (userURLs[shortURL]) {
      urlDatabase[shortURL].longURL = newLongURL;
      res.redirect('/urls');
    } else {
      return res.status(400).send('Bad Request!');
    }
  } else {
    return res.status(400).send('Bad Request!');
  }
});


// DELETE SHORT LINK
app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;
  if (userId) {
    let userURLs = urlsForUser(urlDatabase, userId);
    if (userURLs[shortURL]) {
      delete(urlDatabase[shortURL]);
      res.redirect('/urls');
    } else {
      return res.status(400).send('Bad Request!');
    }
  } else {
    return res.status(401).send('Unauthorized access!');
  }
});


// LINK TO LONG URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(`${longURL}`);
});


// REGISTER
app.get("/register", (req, res) => {
  res.render('user_register');
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  let password = req.body.password;
  if (!email || ! password) {
    return res.status(400).send('Error: Enter email and password!');
  } else if (getUserByEmail(users, email)) {
    return res.status(400).send('Error: Email already exists.  Please Sign in!');
  }
  const userId = generateRandomString();
  password = bcrypt.hashSync(req.body.password, 10);
  users[userId] = {
    id: userId,
    email,
    password,
  };
  req.session.user_id = userId;
  res.redirect('/urls');
});


//LOGIN
app.get('/login', (req, res) => {
  res.render("user_login");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = getUserByEmail(users, email);
  if (!userId) {
    return res.status(400).send('Error: Invalid email!');
  } else if (!bcrypt.compareSync(password, users[userId].password)) {
    return res.status(400).send('Error: Invalid password!');
  }
  req.session.user_id = userId;
  res.redirect('/urls');
});


// LOGOUT
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});