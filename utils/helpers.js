// Generates an alphanumeric string of 6 characters and/or digits
const getRandomID = () => {
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
    if (userDb[userId].email === email) {
      return userDb[userId];
    }
  }

  return null;
};

// Queries database and returns urls associated with the provided user "id"
const urlsForUser = (urlDb, userID) => {
  const userURLs = {}

  for (url in urlDb) {
    if(urlDb[url].userID === userID) {
      userURLs[url] = { ...urlDb[url] }
    }
  }

  return userURLs;
}

// Appends http protocol to urls missing them
const getFullyQualifiedURL = (url) => {
  const prefix = "http://";
  const securePrefix = "https://";

  if(url.includes(prefix) || url.includes(securePrefix)) {
    return url;
  }

  return prefix + url;
}

module.exports = { 
  getRandomID, 
  getUserByEmail, 
  urlsForUser,
  getFullyQualifiedURL
};

