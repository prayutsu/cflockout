// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
const { getStorage, ref } = require("firebase/storage");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCj6-dRL0abZ8-w6bnw2G24phdwDHV4sgs",
  authDomain: "cflockout.firebaseapp.com",
  projectId: "cflockout",
  storageBucket: "cflockout.appspot.com",
  messagingSenderId: "217878345711",
  appId: "1:217878345711:web:e251bd24f60b169e2ca81a",
  measurementId: "G-WEEJNVKXT6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
// const imageStorageRef = ref(storage, "images");

module.exports = {
  app,
  storage,
};
