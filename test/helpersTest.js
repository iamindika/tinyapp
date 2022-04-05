const { assert } = require('chai');
const { 
  getRandomID,
  getUserByEmail,
  urlsForUser,
  getFullyQualifiedURL
} = require('../utils/helpers.js');

describe('getRandomID', function() {
  const randomID = getRandomID();

  it('should be a string', function() {
    assert.equal(typeof randomID, 'string');
  });

  it('should be 6 characters', function() {
    assert.equal(randomID.length, 6);
  })
});

describe('getUserByEmail', function() {
  const testUsers = {
    "userRandomID": {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    },
    "user2RandomID": {
      id: "user2RandomID",
      email: "user2@example.com",
      password: "dishwasher-funk"
    }
  };

  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedUser = {
      id: "userRandomID", 
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };

    assert.deepEqual(user, expectedUser);
  });

  it('should return null with an invalid email', function() {
    const user = getUserByEmail(testUsers, "user3@example.com");
    assert.equal(user, null);
  });
});

describe('urlsForUser', function() {
  const testURLs = {
    "shortRandomURL": {
      longURL: "www.example.com",
      userID: "userRandomID"
    },
    "short2RandomURL": {
      longURL: "www.example2.com",
      userID: "user2RandomID"
    },
    "short3RandomURL": {
      longURL: "www.example3.com",
      userID: "userRandomID"
    }
  };

  it('should return urls that match the user', function() {
    const expectedURLs = {
      "shortRandomURL": {
        longURL: "www.example.com",
        userID: "userRandomID"
      },
      "short3RandomURL": {
        longURL: "www.example3.com",
        userID: "userRandomID"
      }
    }

    const userURLs = urlsForUser(testURLs, "userRandomID");
    assert.deepEqual(userURLs, expectedURLs);
  });

  it('should return empty object if user does not match', function() {
    const userURLs = urlsForUser(testURLs, "user3RandomID");
    assert.deepEqual(userURLs, {});
  });
});

describe('getFullyQualifiedURL', function() {
  it('should append http protocol to urls missing them', function() {
    const appendedURL = getFullyQualifiedURL('www.example.com');
    const expectedURL = 'http://www.example.com';

    assert.equal(appendedURL, expectedURL);
  });

  it('should not append http protocol to urls that have them', function() {
    const url = getFullyQualifiedURL("http://www.example.com");
    const expectedURL = "http://www.example.com"
    
    assert.equal(url, expectedURL);
  });

  it('should not append http protocol to secure urls that have them', function() {
    const url = getFullyQualifiedURL("https://www.example.com");
    const expectedURL = "https://www.example.com"
    
    assert.equal(url, expectedURL);
  })
});