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

const getUser = (userDb, email) => {
  for (const userId in userDb) {
    if (email === userDb[userId].email) {
      return true;
    }
  }
  return false;
}
// Tester code:
// console.log(generateRandomString());

module.exports = { generateRandomString, getUser };

