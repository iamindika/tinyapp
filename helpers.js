// Generates an alphanumeric string of 6 characters and/or digits
const generateRandomString = () => {
  let str = "";
  for (let i = 0; i < 6; i++) {
    let randomChoice = Math.floor(Math.random() * 3) + 1;
    switch (randomChoice) {
    case 1:
      str += Math.floor(Math.random() * 10);
      break;
    case 2:
      str += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      break;
    case 3:
      str += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
      break;
    default:
      break;
    }
  }
  return str;
};

// Queries provided user database for an email and returns the associated user object
const getUserByEmail = (userDb, email) => {
  for (const userId in userDb) {
    if (email === userDb[userId].email) {
      return userId;
    }
  }
  return;
};

// Queries database and returns urls associated with the provided user "id"
const urlsForUser = (urlDb, id) => {
  let userUrls = {};
  for (const shortURL in urlDb) {
    if (urlDb[shortURL].userID === id) {
      userUrls[shortURL] = urlDb[shortURL].longURL;
    }
  }
  return userUrls;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser };

