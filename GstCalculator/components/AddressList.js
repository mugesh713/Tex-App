import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const AddressDetails = () => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('http://192.168.39.254:5000/api/addresses');
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

    fetchAddresses();
  }, []);

  const handleCopy = async (item) => {
    const fullDetails = `Company Name: ${item.companyName}\nAddress: ${item.address}\nGST Number: ${item.gstNumber}\nEmail: ${item.email}`;
    await Clipboard.setStringAsync(fullDetails);
    Alert.alert('Copied!', 'Full address details copied to clipboard.');
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://192.168.39.254:5000/api/addresses/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAddresses((prevAddresses) =>
          prevAddresses.filter((address) => address._id !== id)
        );
        Alert.alert('Deleted!', 'Address has been deleted.');
      } else {
        const errorData = await response.json();
        console.error('Failed to delete address:', errorData.error);
        Alert.alert('Error', 'Failed to delete the address.');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      Alert.alert('Error', 'An error occurred while deleting the address.');
    }
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
