import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// 1. Listen for user state changes (checks if logged in or out on every page load)
onAuthStateChanged(window.firebaseAuth, (user) => {
  if (user) {
    console.log("User is logged in:", user.email);
    window.currentUser = user; 
    
    // Pull the user's cart and wishlist from Firebase
    import("https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js").then(async ({ doc, getDoc, setDoc }) => {
      // --- CART MERGE ---
      const cartRef = doc(window.firebaseDb, "carts", user.uid);
      const cartSnap = await getDoc(cartRef);
      let localCart = JSON.parse(localStorage.getItem('visionbooks_cart') || '[]');
      
      if (cartSnap.exists()) {
        const firebaseCart = cartSnap.data().items || [];
        if (localCart.length === 0 && firebaseCart.length > 0) {
          localStorage.setItem('visionbooks_cart', JSON.stringify(firebaseCart));
          if(window.updateCartBadge) window.updateCartBadge(); 
          if(window.renderCartItems) window.renderCartItems(); 
        } else if (localCart.length > 0) {
          await setDoc(cartRef, { items: localCart });
        }
      } else if (localCart.length > 0) {
        await setDoc(cartRef, { items: localCart });
      }

      // --- WISHLIST MERGE ---
      const wishlistRef = doc(window.firebaseDb, "wishlists", user.uid);
      const wishlistSnap = await getDoc(wishlistRef);
      let localWishlist = JSON.parse(localStorage.getItem('visionbooks_wishlist') || '[]');
      
      if (wishlistSnap.exists()) {
        const firebaseWishlist = wishlistSnap.data().items || [];
        if (localWishlist.length === 0 && firebaseWishlist.length > 0) {
          localStorage.setItem('visionbooks_wishlist', JSON.stringify(firebaseWishlist));
          if(window.updateWishlistBadge) window.updateWishlistBadge();
        } else if (localWishlist.length > 0) {
          await setDoc(wishlistRef, { items: localWishlist });
        }
      } else if (localWishlist.length > 0) {
        await setDoc(wishlistRef, { items: localWishlist });
      }
    });

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
