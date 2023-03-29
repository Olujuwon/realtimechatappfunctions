const loadFunctions = require("firebase-function-tools");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

try {
  admin.initializeApp(functions.config().firebase);
} catch (e) {
  console.log("error", e.message);
}

loadFunctions(__dirname, exports, true);
