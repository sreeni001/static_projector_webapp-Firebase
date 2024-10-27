// Import Firebase Admin SDK
const admin = require('firebase-admin');
require('dotenv').config();

// Firebase Admin configuration
const serviceAccount = require('./config/access.json'); // Add the path to your service account JSON file here

// Initialize Firebase
function connectToFirebase() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.dburl
        });
        console.log("Firebase connected successfully...");
    }
    return admin.database();
}

module.exports = connectToFirebase;
