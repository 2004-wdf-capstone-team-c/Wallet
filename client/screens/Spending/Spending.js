import React from "react";
import { View, Text, TextInput, Button } from "react-native";
import { connect } from "react-redux";
// import { fetchTransactions } from "../../store/spending";
import axios from "axios";
const server = "http://localhost:8080";

export class SpendingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fetchTrans = this.fetchTrans.bind(this);
  }
  componentDidMount() {
    this.fetchTrans();
  }

  async fetchTrans() {
    try {
      const res = await axios.get(`${server}/api/transactions`);
      console.log(res.data);
    } catch (error) {
      console.log("ERRORrrrrr", error);
    }
  }
  render() {
    return (
      <View>
        <Text style={Styles.heading}>Spending</Text>
        <View>
          <Text>Net Cash Flow</Text>
          <View>
            <Text>Graph</Text>
          </View>
        </View>
        <View>
          <Text>Transactions</Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    transactions: state.requestedTransactions,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchTransactions: () => dispatch(fetchTransactions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpendingScreen);

const Styles = {
  heading: {
    fontSize: 35,
    color: "green",
  },
};
