import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './components/HomePage';
import AddressDetails from './components/AddressDetails';
import AddressList from './components/AddressList';
import GstCalculator from './components/GstCalculator';
import BillGenerator from './components/BillGenerator';
import CottonPricePrediction from './components/CottonPricePrediction';
import AboutTheLooms from './components/AboutTheLooms';
import SavedBills from './components/SavedBills';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Address Details" component={AddressDetails} />
        <Stack.Screen name="GST Calculator" component={GstCalculator} />
        <Stack.Screen name="Bill Generator" component={BillGenerator} />
        <Stack.Screen name="Cotton Price Prediction" component={CottonPricePrediction} />
        <Stack.Screen name="About the Looms" component={AboutTheLooms} />
        <Stack.Screen name="Address List" component={AddressList} />
        <Stack.Screen name="Saved Bills" component={SavedBills} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
