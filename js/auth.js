import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// showToast is now provided by utils.js

// Utility: check if a uid belongs to an admin
async function checkIsAdmin(uid) {
    try {
        const snap = await getDoc(doc(window.firebaseDb, 'admins', uid));
        return snap.exists();
    } catch {
        return false;
    }
}

// Utility: Create user profile in Firestore
async function createUserProfile(user) {
    try {
        await setDoc(doc(window.firebaseDb, 'users', user.uid), {
            email: user.email,
            displayName: '',
            phone: '',
            address: '',
            city: '',
            createdAt: new Date().toISOString(),
            emailVerified: user.emailVerified || false
        });
    } catch (e) {
        console.error('Error creating user profile:', e);
    }
}

// Utility: Get user profile from Firestore
async function getUserProfile(uid) {
    try {
        const snap = await getDoc(doc(window.firebaseDb, 'users', uid));
        if (snap.exists()) {
            return { id: snap.id, ...snap.data() };
        }
        return null;
    } catch (e) {
        console.error('Error getting user profile:', e);
        return null;
    }
}

// Utility: Update user profile in Firestore
async function updateUserProfile(uid, data) {
    try {
        await updateDoc(doc(window.firebaseDb, 'users', uid), {
            ...data,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (e) {
        console.error('Error updating user profile:', e);
        return false;
    }
}

// Utility: Get user orders from Firestore
async function getUserOrders(uid) {
    try {
        const q = query(collection(window.firebaseDb, 'orders'), where('user_id', '==', uid));
        const snapshot = await getDocs(q);
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        // Sort by date descending
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return orders;
    } catch (e) {
        console.error('Error getting user orders:', e);
        return [];
    }
}

// 1. Listen for auth state changes on every page load
onAuthStateChanged(window.firebaseAuth, async (user) => {
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const accountDropdown = document.getElementById('accountDropdown');

    if (user) {
        window.currentUser = user;
        const admin = await checkIsAdmin(user.uid);
        window.currentUserIsAdmin = admin;

        // Update nav button text
        if (loginBtnText) loginBtnText.textContent = admin ? 'Dashboard' : 'Account';
        
        // Update nav button click behavior
        if (loginBtn) {
            if (admin) {
                loginBtn.onclick = () => window.location.href = 'admin.html';
            } else {
                loginBtn.onclick = (e) => {
                    e.stopPropagation();
                    const dropdown = document.getElementById('accountDropdown');
                    if (dropdown) dropdown.classList.toggle('show');
                };
            }
        }

        // Cart & Wishlist merge from Firebase into localStorage
        import("https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js").then(async ({ doc: fdoc, getDoc: fget, setDoc: fset }) => {
            // Cart
            const cartRef = fdoc(window.firebaseDb, "carts", user.uid);
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
            const wlRef = fdoc(window.firebaseDb, "wishlists", user.uid);
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
        
        // Ensure dropdown is hidden for non-logged in users
        if (accountDropdown) accountDropdown.classList.remove('show');
    }
});

// 2. Sign Up
window.signUpUser = async (email, password) => {
    try {
        const cred = await createUserWithEmailAndPassword(window.firebaseAuth, email, password);
        // Create user profile in Firestore
        await createUserProfile(cred.user);
        showToast('Account created successfully!', 'success');
        return cred.user;
    } catch (error) {
        showToast('Sign up failed: ' + error.message, 'error');
        return null;
    }
};

// 3. Log In
window.logInUser = async (email, password) => {
    try {
        const cred = await signInWithEmailAndPassword(window.firebaseAuth, email, password);
        showToast('Login successful!', 'success');
        return cred.user;
    } catch (error) {
        showToast('Login failed: ' + error.message, 'error');
        return null;
    }
};

// 4. Log Out
window.logOutUser = async () => {
    try {
        await signOut(window.firebaseAuth);
        showToast('Logged out successfully', 'info');
        window.location.href = 'index.html';
    } catch (error) {
        showToast('Logout failed: ' + error.message, 'error');
    }
};

// 5. Password Reset
window.resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(window.firebaseAuth, email);
        showToast('Password reset email sent! Check your inbox.', 'success');
        return true;
    } catch (error) {
        showToast('Password reset failed: ' + error.message, 'error');
        return false;
    }
};

// 6. Send Email Verification
window.sendVerificationEmail = async () => {
    try {
        if (window.currentUser) {
            await sendEmailVerification(window.currentUser);
            showToast('Verification email sent! Check your inbox.', 'success');
            return true;
        }
        return false;
    } catch (error) {
        showToast('Verification failed: ' + error.message, 'error');
        return false;
    }
};

// 7. Get User Profile
window.getUserProfile = getUserProfile;

// 8. Update User Profile
window.updateUserProfile = async (data) => {
    if (!window.currentUser) {
        showToast('You must be logged in to update profile', 'error');
        return false;
    }
    const success = await updateUserProfile(window.currentUser.uid, data);
    if (success) {
        showToast('Profile updated successfully!', 'success');
    }
    return success;
};

// 9. Get User Orders
window.getUserOrders = getUserOrders;

// 10. Expose admin check for other scripts
window.checkIsAdmin = checkIsAdmin;
