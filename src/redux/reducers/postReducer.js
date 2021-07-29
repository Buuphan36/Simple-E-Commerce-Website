const INITIAL_STATE = {
    creator_id: "",
    creator_name: "",
    name: "",
    price: "",
    description: "",
    file_name: "",
  };
  
  const postReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "SET_NAME":
        return {
          ...state,
          name: action.name,
        };
      case "SET_PRICE":
        return {
          ...state,
          price: action.price,
        };
      case "SET_DESCRIPTION":
        return {
          ...state,
          description: action.description,
        };
      case "SET_FILE_NAME":
        return {
          ...state,
          file_name: action.file_name,
        };
      default:
        return state;
    }
  };
  
  export default postReducer;