// We use type="module" links to import Firebase directly from their CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVTvJ2dRcG4_jjK7EtExFNidwdZAvf3-A",
    authDomain: "visionweb-e70d0.firebaseapp.com",
    projectId: "visionweb-e70d0",
    storageBucket: "visionweb-e70d0.firebasestorage.app",
    messagingSenderId: "757804753858",
    appId: "1:757804753858:web:59b0d07be9435722e0ec5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Make them globally available so your other JS files (like cart.js) can use them!
window.firebaseDb = db;
window.firebaseAuth = auth;

console.log("Firebase initialized successfully");
