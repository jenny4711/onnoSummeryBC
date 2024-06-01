const admin = require('firebase-admin');
const serviceAccount = require('path/to/firebasecreds.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;