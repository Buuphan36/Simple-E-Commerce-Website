export const setUsername = username => ({
    type: 'USER_SET_USERNAME',
    username,
});

export const setUserEmail = userEmail =>({
    type: 'USER_SET_USER_EMAIL',
    userEmail,
});

export const setUserPassword = userPassword =>({
    type: 'USER_SET_USER_PASSWORD',
    userPassword,
});

export const setUserId = userId =>({
    type: 'USER_SET_USER_ID',
    userId,
});

export const setUserProfile = userProfile=>({
    type: 'USER_SET_USER_PROFILE',
    userProfile,
});

export const setIsLoggedIn = isLoggedIn =>({
    type: 'USER_SET_IS_LOGGED_IN',
    isLoggedIn,
});

export const setCartItems = cartItems =>({
    type: 'USER_SET_CART_ITEMS',
    cartItems,
});
