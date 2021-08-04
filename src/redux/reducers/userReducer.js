const INITIAL_STATE = {
  username: "",
  userEmail: "",
  userPassword: "",
  userId: "",
  userProfile: "",
  isLoggedIn: false,
  cartItems: [],
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "USER_SET_USERNAME":
      return {
        ...state,
        username: action.username,
      };
    case "USER_SET_USER_EMAIL":
      return {
        ...state,
        userEmail: action.userEmail,
      };
    case "USER_SET_USER_PASSWORD":
      return {
        ...state,
        userPassword: action.userPassword,
      };
    case "USER_SET_USER_ID":
      return {
        ...state,
        userId: action.userId,
      };
    case "USER_SET_USER_PROFILE":
      return {
        ...state,
        userProfile: action.userProfile,
      };
    case "USER_SET_IS_LOGGED_IN":
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
      };
    case "USER_SET_CART_ITEMS":
      console.log("action: " + JSON.stringify(action))
      return {
        ...state,
        cartItems: action.cartItems,
      }
      
    case "USER_SET_LOG_OUT":
      return INITIAL_STATE;

    default:
      return state;
  }
};

export default userReducer;
