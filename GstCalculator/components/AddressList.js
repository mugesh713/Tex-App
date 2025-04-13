import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const AddressDetails = () => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('http://192.168.43.254:5000/api/addresses');
      const data = await response.json();
      if (response.ok) {
        setAddresses(data);
      } else {
        console.error('Failed to fetch addresses:', data.error);
        Alert.alert('Error', 'Failed to fetch addresses.');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Alert.alert('Error', 'An error occurred while fetching the addresses.');
    }
  };

  const handleCopy = async (item) => {
    const fullDetails = `Company Name: ${item.companyName}\nAddress: ${item.address}\nGST Number: ${item.gstNumber}\nEmail: ${item.email}`;
    await Clipboard.setStringAsync(fullDetails);
    Alert.alert('Copied!', 'Full address details copied to clipboard.');
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await fetch(`http://192.168.43.254:5000/api/addresses/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              const text = await response.text(); // Read response as text first
              console.log('Raw API Response:', text);

              if (response.ok) {
                setAddresses((prevAddresses) =>
                  prevAddresses.filter((address) => address._id !== id)
                );
                Alert.alert('Deleted!', 'Address has been deleted.');
              } else {
                try {
                  const errorData = JSON.parse(text); // Try parsing as JSON
                  console.error('Failed to delete address:', errorData.error);
                  Alert.alert('Error', errorData.error || 'Failed to delete the address.');
                } catch (jsonError) {
                  console.error('Error parsing JSON:', text);
                  Alert.alert('Error', 'Unexpected server response.');
                }
              }
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'An error occurred while deleting the address.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Addresses</Text>

      {addresses.length > 0 ? (
        <FlatList
          data={addresses}
          renderItem={({ item }) => (
            <View style={styles.addressCard}>
              <Text style={styles.companyName}>{item.companyName}</Text>
              <Text>{item.address}</Text>
              <Text>{item.gstNumber}</Text>
              <Text>{item.email}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Copy Full Details"
                  onPress={() => handleCopy(item)}
                  color="#4CAF50"
                />
                <Button
                  title="Delete"
                  onPress={() => handleDelete(item._id)}
                  color="#F44336"
                />
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id.toString()}
        />
      ) : (
        <Text>No addresses saved.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addressCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AddressDetails;
