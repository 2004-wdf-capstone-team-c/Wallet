import React, { Component } from "react";
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Text } from "native-base";
import { Button } from 'react-native-elements';
import { fetchBudget } from "../../store/budget";
import { styles, pieColors } from '../../styles';
// import Pie from './Pie';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};


class Budget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.props.fetchBudget(this.props.user.id)
  }

  getData() {
    // console.log('PROPS', this.props.budget)
    const budget = this.props.budget;
    let pieData = [];
    let categories = [
      'foodAndDrink',
      'community',
      'healthcare',
      'recreation',
      'service',
      'shops',
      'travel'
    ];

    let i = 0;
    for (let key in budget) {
      if (categories.includes(key)) {
        pieData.push({ 
          name: key,
          amount: budget[key],
          color: pieColors[i],
          legendFontColor: "#7F7F7F",
          legendFontSize: 15 
        });
        i++;
      }
    }
    return pieData;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Budget</Text>
          <PieChart
            data={this.getData()}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <Button
            type="outline"
            block style={{ margin: 100, marginTop: 40 }} 
            title={'Edit Budget'}
            onPress={() => {
              this.props.navigation.navigate('BudgetSetup', {
                title: 'BudgetSetup'
              });
            }}
          />
      </View>
    );
  }
}

const mapState = state => {
  return {
    user: state.user,
    budget: state.budget,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchBudget: (id) => dispatch(fetchBudget(id)),
  };
};

export default connect(mapState, mapDispatch)(Budget);
