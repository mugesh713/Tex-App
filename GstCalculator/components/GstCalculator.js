import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker as ReactNativePicker } from '@react-native-picker/picker';

export default function GstCalculator() {
  const [amount, setAmount] = useState('');
  const [gstType, setGstType] = useState('intra-state');
  const [gstPercentage, setGstPercentage] = useState('');
  const [result, setResult] = useState(null);

  const calculateGst = () => {
    if (!amount || !gstPercentage || !gstType) {
      alert('Please fill in all fields');
      return;
    }

    const inputAmount = parseFloat(amount);
    const gstPercent = parseFloat(gstPercentage);
    let gstAmount = 0;
    let totalAmount = 0;

    if (gstType === 'inter-state') {
      gstAmount = (inputAmount * gstPercent) / 100;
      totalAmount = inputAmount + gstAmount;
      setResult({
        inputAmount,
        gstAmount: gstAmount.toFixed(2),
        cgst: null,
        sgst: null,
        totalAmount: totalAmount.toFixed(2),
      });
    } else if (gstType === 'intra-state') {
      const halfGst = gstPercent / 2;
      const cgst = (inputAmount * halfGst) / 100;
      const sgst = (inputAmount * halfGst) / 100;
      gstAmount = cgst + sgst;
      totalAmount = inputAmount + gstAmount;
      setResult({
        inputAmount,
        gstAmount: null,
        cgst: cgst.toFixed(2),
        sgst: sgst.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      });
    }
  };

  const renderTable = () => {
    if (result) {
      return (
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Amount</Text>
            {gstType === 'inter-state' ? (
              <Text style={styles.tableHeader}>IGST</Text>
            ) : (
              <>
                <Text style={styles.tableHeader}>CGST</Text>
                <Text style={styles.tableHeader}>SGST</Text>
              </>
            )}
            <Text style={styles.tableHeader}>Total Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableData}>{result.inputAmount}</Text>
            {gstType === 'inter-state' ? (
              <Text style={styles.tableData}>{result.gstAmount}</Text>
            ) : (
              <>
                <Text style={styles.tableData}>{result.cgst}</Text>
                <Text style={styles.tableData}>{result.sgst}</Text>
              </>
            )}
            <Text style={styles.tableData}>{result.totalAmount}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>GST Calculator India</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <View style={styles.radioButtons}>
        <Button title="Intra-State" onPress={() => setGstType('intra-state')} />
        <Button title="Inter-State" onPress={() => setGstType('inter-state')} />
      </View>
      <Text style={styles.label}>Select GST Percentage</Text>
      <ReactNativePicker
        selectedValue={gstPercentage}
        style={styles.picker}
        onValueChange={setGstPercentage}
      >
        <ReactNativePicker.Item label="Select GST Percentage" value="" />
        <ReactNativePicker.Item label="5%" value="5" />
        <ReactNativePicker.Item label="12%" value="12" />
        <ReactNativePicker.Item label="18%" value="18" />
        <ReactNativePicker.Item label="28%" value="28" />
      </ReactNativePicker>
      <Button title="Calculate" onPress={calculateGst} />
      {renderTable()}
      <Button
        title="Clear"
        onPress={() => {
          setAmount('');
          setGstPercentage('');
          setResult(null);
          setGstType('intra-state');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  radioButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  picker: {
    height: 50,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#f8f8f8',
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: '25%',
  },
  tableData: {
    textAlign: 'center',
    width: '25%',
  },
});
 