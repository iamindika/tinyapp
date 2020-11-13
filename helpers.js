const generateRandomString = () => {
  let str = "";
  for (let i = 0; i < 6; i++){
    let randomChoice = Math.floor(Math.random() * 3) + 1;
    switch(randomChoice) {
    case 1:
      str += Math.floor(Math.random() * 10);
      break;
    case 2:
      str += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
      break;
    case 3:
      str += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    default:
      break;
    }
  }
  return str;
}

const getUserByEmail = (userDb, email) => {
  for (const userId in userDb) {
    if (email === userDb[userId].email) {
      return userId;
    }
  }
  return;
};

const urlsForUser = (urlDb, id) => {
  let userUrls = {};
  for (const shortURL in urlDb) {
    if (urlDb[shortURL].userID === id) {
      userUrls[shortURL] = urlDb[shortURL].longURL;
    }
  }
  return userUrls;
};
// Tester code:
// console.log(generateRandomString());

// const urlDatabase = {
//   b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
//   i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
// };

// console.log(urlsForUser(urlDatabase, "aJ48lW"));

// const bcrypt = require('bcrypt');
// const pass1 = bcrypt.hashSync("aJ48lW", 10);
// const pass2 = bcrypt.hashSync("aJ48lW", 10);
// console.log('password 1: ', pass1, 'password 2: ', pass2);
// console.log(pass1 === pass2);

module.exports = { generateRandomString, getUserByEmail, urlsForUser };

