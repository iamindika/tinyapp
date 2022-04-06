const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const methodOverride = require('method-override');
const { 
  getRandomID, 
  getUserByEmail,
  urlsForUser,
  getFullyQualifiedURL
} = require('./utils/helpers');

// MIDDLEWARE && SERVER SETUP
const app = express();
const PORT = 8080;
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({ secret: 'uncrackable' }));
app.set("view engine", "ejs");
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// DATABASES
const urlDatabase = {};

const users = {}

const error = { msg: "" }

app.get("/", (req, res) => {
  const userID = req.session && req.session.user_id;
  const user = userID && users[userID];

  if(!user) {
    if(userID) {
      req.session = null;
    }

    error.msg = "Authentication Required!"
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

app.get("/urls", (req, res) => {
  const userID = req.session && req.session.user_id;
  const user = userID && users[userID];
  let userURLs;

  if(!user && userID) {
    req.session = null;
  } else {
    userURLs = urlsForUser(urlDatabase, userID);
  }

  const templateVars = {
    urls: userURLs,
    user, 
    error: error.msg
  };

  res.render("urls_index", templateVars);
  error.msg = "";
});

app.post("/urls", (req, res) => {
  const userID = req.session && req.session.user_id;
  const user = userID && users[userID];

  if(!user) {
    if(userID){
      req.session = null;
    }

    error.msg = "Authentication Required!"
    res.redirect("/login");
  } else {
    const longURL = getFullyQualifiedURL(req.body.longURL);
    let shortURL;
  
    do {
      shortURL = getRandomID();
    } while (urlDatabase[shortURL]);
  
    urlDatabase[shortURL] = { longURL, userID }; 
    res.redirect(`/urls/${shortURL}`);
  }
});

app.get("/urls/new", (req, res) => {
  const userID = req.session && req.session.user_id;
  const user = userID && users[userID];

  if(!user) {
    if(userID) {
      req.session = null;
    }

    error.msg = "Authentication Required!"
    res.redirect("/login");
  } else {
    res.render("urls_new", { user });
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session && req.session.user_id;
  const user = userID && users[userID];
  const { shortURL } = req.params;

  if(!user) {
    if(userID) {
      req.session = null;
    }

    error.msg = "Authentication Required!"
    res.redirect("/login");
  } else if(!urlDatabase[shortURL]){
    error.msg = `ShortURL: ${shortURL} does not exist!`;
    res.redirect("/urls");
  } else if(user.id !== urlDatabase[shortURL].userID) {
    error.msg = "Forbidden!"
    res.redirect("/urls")
  } else {
    const longURL = urlDatabase[shortURL].longURL;
    const templateVars = { shortURL, longURL, user };
  
    res.render("urls_show", templateVars);
  }
});

app.put("/urls/:shortURL", (req, res) => {
  const userID = req.session && req.session.user_id;
  const user = userID && users[userID];
  const userURLs = urlsForUser(urlDatabase, userID);

  if(user) {
    const { shortURL } = req.params;
    const longURL = getFullyQualifiedURL(req.body.longURL);
    
    if(userURLs[shortURL]) {
      if(longURL !== userURLs[shortURL].longURL) {
        urlDatabase[shortURL].longURL = longURL;
      }
      
      res.redirect("/urls");
    } else {
      if(urlDatabase[shortURL]) {
        error.msg = 'Forbidden!';
      } else {
        error.msg = `ShortURL: ${shorturL} does not exist!`;
      }

      res.redirect("/urls");
    }
  } else {
    if(userID) {
      req.session = null;
    }
    error.msg = "Authentication Required!"
    res.status(401);
    res.redirect("/login");
  }
});

app.delete("/urls/:shortURL", (req, res) => {
  const userID = req.session && req.session.user_id;
  const user = userID && users[userID];
  const userURLs = urlsForUser(urlDatabase, userID);

  if(user) {
    const { shortURL } = req.params;

    if(userURLs[shortURL]) {
      delete urlDatabase[shortURL];
    
      res.redirect("/urls");
    } else {
      if(urlDatabase[shortURL]) {
        error.msg = 'Forbidden!';
      } else {
        error.msg = `ShortURL: ${shorturL} does not exist!`;
      }

      res.redirect("/urls");
    }
  } else {
    if(userID) {
      req.session = null;
    }
    error.msg = "Authentication Required!";
    res.redirect("/login");
  }
});

app.get("/u/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const longURL = urlDatabase[shortURL] && urlDatabase[shortURL].longURL;

  if(longURL) {
    res.redirect(longURL);
  } else {
    error.msg = `ShortURL: ${shortURL} does not exist!`;
    res.redirect("/urls");
  }
});

app.get("/login", (req, res) => {
  const userID = req.session && req.session["user_id"];
  const user = userID && users[userID];

  if(user) {
    res.redirect("/urls");
  } else {
    if(userID) {
      req.session = null;
    }

    res.render("user_login", { user: null, error: error.msg })
    error.msg = "";
  }
})

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  if(!email || !password) {
    error.msg = "Please fill all fields!";
    res.redirect("/login");
  } else {
    const user = getUserByEmail(users, email);

    if(user && bcrypt.compareSync(password, user.password)) {
      req.session.user_id = user.id;
      res.redirect("/urls");
    } else {
      error.msg = "Incorrect email or password!"
      res.redirect("/login");
    }
  }
})

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
})

app.get("/register", (req, res) => {
  const userID = req.session && req.session["user_id"];
  const user = userID && users[userID];

  if(!user) {
    if(userID) {
      req.session = null;
    }

    res.render("user_register", { user, error: error.msg });
    error.msg = "";
  } else {
    res.redirect("/urls");
  }
})

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    error.msg = "Please fill in all fields!"
    res.redirect("/register");
  } else if(getUserByEmail(users, email)) {
    error.msg = "User already exists! Please login!"
    res.redirect("/login");
  } else {
    let id;
    bcrypt.hash(password, salt)
      .then(hashedPassword => {
        
        do {
          id = getRandomID();
        } while(users[id]);
        
        users[id] = { id, email, password: hashedPassword };
        req.session.user_id = id;
        res.redirect("/urls");
      })
      .catch(e => {
        error = e.message;
        res.redirect("/register");
      })
    
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>");
});