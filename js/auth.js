import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Utility: check if a uid belongs to an admin
async function checkIsAdmin(uid) {
    try {
        const snap = await getDoc(doc(window.firebaseDb, 'admins', uid));
        return snap.exists();
    } catch {
        return false;
    }
}

// 1. Listen for auth state changes on every page load
onAuthStateChanged(window.firebaseAuth, async (user) => {
    const loginBtn     = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');

    if (user) {
        window.currentUser = user;
        const admin = await checkIsAdmin(user.uid);
        window.currentUserIsAdmin = admin;

        // Update nav button
        if (loginBtnText) loginBtnText.textContent = admin ? 'Dashboard' : 'Account';
        if (loginBtn) loginBtn.onclick = () => window.location.href = admin ? 'admin.html' : 'login.html';

        // Cart & Wishlist merge from Firebase into localStorage
        import("https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js").then(async ({ doc: fdoc, getDoc: fget, setDoc: fset }) => {
            // Cart
            const cartRef  = fdoc(window.firebaseDb, "carts", user.uid);
            const cartSnap = await fget(cartRef);
            const localCart = JSON.parse(localStorage.getItem('visionbooks_cart') || '[]');
            if (cartSnap.exists()) {
                const fbCart = cartSnap.data().items || [];
                if (localCart.length === 0 && fbCart.length > 0) {
                    localStorage.setItem('visionbooks_cart', JSON.stringify(fbCart));
                    if (window.updateCartBadge) window.updateCartBadge();
                    if (window.renderCartItems) window.renderCartItems();
                } else if (localCart.length > 0) {
                    await fset(cartRef, { items: localCart });
                }
            } else if (localCart.length > 0) {
                await fset(cartRef, { items: localCart });
            }

            // Wishlist
            const wlRef  = fdoc(window.firebaseDb, "wishlists", user.uid);
            const wlSnap = await fget(wlRef);
            const localWl = JSON.parse(localStorage.getItem('visionbooks_wishlist') || '[]');
            if (wlSnap.exists()) {
                const fbWl = wlSnap.data().items || [];
                if (localWl.length === 0 && fbWl.length > 0) {
                    localStorage.setItem('visionbooks_wishlist', JSON.stringify(fbWl));
                    if (window.updateWishlistBadge) window.updateWishlistBadge();
                } else if (localWl.length > 0) {
                    await fset(wlRef, { items: localWl });
                }
            } else if (localWl.length > 0) {
                await fset(wlRef, { items: localWl });
            }
        });
    } else {
        window.currentUser = null;
        window.currentUserIsAdmin = false;
        if (loginBtnText) loginBtnText.textContent = 'Login';
        if (loginBtn) loginBtn.onclick = () => window.location.href = 'login.html';
    }
});

// 2. Sign Up
window.signUpUser = async (email, password) => {
    try {
        const cred = await createUserWithEmailAndPassword(window.firebaseAuth, email, password);
        return cred.user;
    } catch (error) {
        alert("Sign up failed: " + error.message);
        return null;
    }
};

// 3. Log In
window.logInUser = async (email, password) => {
    try {
        const cred = await signInWithEmailAndPassword(window.firebaseAuth, email, password);
        return cred.user;
    } catch (error) {
        alert("Login failed: " + error.message);
        return null;
    }
};

// 4. Log Out
window.logOutUser = async () => {
    try {
        await signOut(window.firebaseAuth);
        window.location.href = 'index.html';
    } catch (error) {
        alert("Logout failed: " + error.message);
    }
};

// 5. Expose admin check for other scripts
window.checkIsAdmin = checkIsAdmin;
