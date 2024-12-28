import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function HomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to GST Calculator"
          onPress={() => navigation.navigate('GST Calculator')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Bill Generator"
          onPress={() => navigation.navigate('Bill Generator')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Cotton Price Prediction"
          onPress={() => navigation.navigate('Cotton Price Prediction')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to About the Looms"
          onPress={() => navigation.navigate('About the Looms')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Address Details"
          onPress={() => navigation.navigate('Address Details')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="View Address List"
          onPress={() => navigation.navigate('Address List')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="SavedBills"
          onPress={() => navigation.navigate('Excel Screen')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginVertical: 8, // Adjusts space between each button
  },
});
