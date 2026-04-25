import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// 1. Listen for user state changes (checks if logged in or out on every page load)
onAuthStateChanged(window.firebaseAuth, (user) => {
    if (user) {
        console.log("User is logged in:", user.email);
        window.currentUser = user; // Save globally so cart/wishlist can use it

        // TODO later: Merge local cart into Firebase cart here
    } else {
        console.log("User is logged out");
        window.currentUser = null;
    }
});

// 2. Function to Sign Up
window.signUpUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(window.firebaseAuth, email, password);
        alert("Account created successfully!");
        return userCredential.user;
    } catch (error) {
        console.error("Error signing up:", error.message);
        alert("Error: " + error.message);
    }
};

// 3. Function to Log In
window.logInUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(window.firebaseAuth, email, password);
        alert("Logged in successfully!");
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in:", error.message);
        alert("Error: " + error.message);
    }
};

// 4. Function to Log Out
window.logOutUser = async () => {
    try {
        await signOut(window.firebaseAuth);
        alert("Logged out successfully!");
    } catch (error) {
        console.error("Error logging out:", error.message);
    }
};
