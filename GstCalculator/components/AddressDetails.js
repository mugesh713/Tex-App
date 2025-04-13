import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddressForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    gstNumber: '',
    email: '',
  });

  const navigation = useNavigation(); // Access the navigation prop

  // Update form data when inputs change
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle the form submission
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.43.254:5000/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Address saved successfully');
        setFormData({ companyName: '', address: '', gstNumber: '', email: '' }); // Clear the form
        navigation.navigate('Address Details'); // Navigate to Address Details screen after saving
      } else {
        Alert.alert('Error', result.error || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Address Details</Text>

      <Text style={styles.label}>Company Name:</Text>
      <TextInput
        style={styles.input}
        value={formData.companyName}
        onChangeText={(value) => handleChange('companyName', value)}
        placeholder="Enter company name"
      />

      <Text style={styles.label}>Address:</Text>
      <TextInput
        style={styles.input}
        value={formData.address}
        onChangeText={(value) => handleChange('address', value)}
        placeholder="Enter address"
      />

      <Text style={styles.label}>GST Number:</Text>
      <TextInput
        style={styles.input}
        value={formData.gstNumber}
        onChangeText={(value) => handleChange('gstNumber', value)}
        placeholder="Enter GST number"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        placeholder="Enter email"
        keyboardType="email-address"
      />

      <Button title="Save" onPress={handleSubmit} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});

export default AddressForm;
