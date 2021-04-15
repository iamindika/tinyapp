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

const validateInput = (email, password) => {
  return email && password;
};

const findUser = (users, email) => {
  for (let id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }

  return null;
};

const validateCredentials = (user, password) => {
  return user.password === password;
}

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

  const userDatabase = {}

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
  const { user_id: userId } = req.cookies;
  const templateVars = {
    user: userDatabase[userId],
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
  const { user_id: userId } = req.cookies;
  const templateVars = {
    user: userDatabase[userId]
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const { user_id: userId } = req.cookies;
  const templateVars = {
    user: userDatabase[userId],
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

app.post("/logout", (req, res) => {
  console.log(userDatabase);
  res
    .clearCookie("user_id")
    .redirect("/urls");
});

app.get("/register", (req, res) => {
  const { user_id } = req.cookies;
  const templateVars = {
    user: userDatabase[user_id]
  }
  res.render("user_register", templateVars);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (validateInput(email, password)) {
    const user = findUser(userDatabase, email);
    if (!user) {
      let id; 
      do {
        id = generateRandomString();
      } while (userDatabase[id]);
      userDatabase[id] = {
        id,
        email,
        password
      }
      res
        .cookie("user_id", id)
        .redirect("/urls");
    } else {
      res
        .status(400)
        .send("User already exists!");
    }
  } else {
    res
      .status(400)
      .send("Please fill in all fields!");
  }
});

app.get("/login", (req, res) => {
  const { user_id: userId } = req.cookies;
  const templateVars = {
    user: userDatabase[userId]
  }
  res.render("user_login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (validateInput(email, password)) {
    const user = findUser(userDatabase, email);
    if (user) {
      if (validateCredentials(user, password)) {
        res
        .cookie("user_id", user.id)
        .redirect("/urls");
      } else {
        res
          .status(403)
          .send("Invalid credentials!");
      }
    } else {
      res
        .status(403)
        .send("That user does not exist!");
    }
  } else {
    res
      .status(403)
      .send("Please fill in all fields!");
  }
})