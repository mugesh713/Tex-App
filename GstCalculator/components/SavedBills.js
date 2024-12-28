import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const SavedBills = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/saved-invoices')
      .then(res => setInvoices(res.data))
      .catch(err => console.error(err));
  }, []);

  const renderInvoice = ({ item }) => (
    <View style={styles.invoiceItem}>
      <Text>{item.fileName}</Text>
      <Text>{new Date(item.dateCreated).toLocaleDateString()}</Text>
      <Button title="View" onPress={() => alert(`File Path: ${item.filePath}`)} />
    </View>
  );

  return (
    <FlatList
      data={invoices}
      keyExtractor={(item) => item._id}
      renderItem={renderInvoice}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  invoiceItem: { padding: 10, marginVertical: 5, backgroundColor: '#f0f0f0' },
});

export default SavedBills;
