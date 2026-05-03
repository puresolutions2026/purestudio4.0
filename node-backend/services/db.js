const { Firestore } = require('@google-cloud/firestore');
require('dotenv').config();

const db = new Firestore({
  projectId: process.env.PROJECT_ID,
});

module.exports = db;
