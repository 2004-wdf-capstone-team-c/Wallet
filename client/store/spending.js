import axios from "axios";

//action types
const GET_TRANSACTIONS = "GET_TRANSACTIONS";

//action creators
export const getTransactions = (requestedTransactions) => ({
  type: GET_TRANSACTIONS,
  requestedTransactions,
});

//state
const initialDefaultTransactions = [];

//thunks
export const fetchTransactions = () => {
  console.log("fetching");
  return async (dispatch) => {
    try {
      console.log("inside thunk");
      const { data } = await axios.get(`/api/transactions`);
      console.log("data", data);
      if (data) {
        dispatch(getTransactions(data));
      }
    } catch (error) {
      console.log("errrRRRRRRor", error);
    }
  };
};

//reducers

export default function (state = initialDefaultTransactions, action) {
  switch (action.type) {
    case GET_TRANSACTIONS:
      console.log("inside reducer");
      return action.requestedTransactions;
    default:
      return state;
  }
}
