import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import axios from 'axios';

export default function InvoiceGenerator() {
  const [billedTo, setBilledTo] = useState('');
  const [deliveredTo, setDeliveredTo] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [agent, setAgent] = useState('');
  const [email, setEmail] = useState('');
  const [items, setItems] = useState([{ description: '', hsnCode: '', qty: '', rate: '', per: '', amount: '', gstPercent: '', gstType: '', gstAmount: '', amountWithoutGST: '' }]);
  const [fileName, setFileName] = useState('Tax_Invoice');

  const addItem = () => {
    setItems([...items, { description: '', hsnCode: '', qty: '', rate: '', per: '', amount: '', gstPercent: '', gstType: '', gstAmount: '', amountWithoutGST: '' }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'qty' || field === 'rate' || field === 'gstPercent') {
      const qty = parseFloat(newItems[index].qty) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      const gstPercent = parseFloat(newItems[index].gstPercent) || 0;
      newItems[index].amount = (qty * rate).toFixed(2);

      // Calculate GST amount based on GST percent
      const amount = qty * rate;
      newItems[index].gstAmount = ((amount * gstPercent) / 100).toFixed(2);

      // Calculate Amount without GST
      const amountWithoutGST = (amount / (1 + gstPercent / 100)).toFixed(2);
      newItems[index].amountWithoutGST = amountWithoutGST;
    }
    setItems(newItems);
  };

  const handleGSTTypeChange = (index, gstType) => {
    const newItems = [...items];
    newItems[index].gstType = gstType;
    if (gstType === 'Inter-State') {
      newItems[index].gstPercent = '18'; // Set default for Inter-State
    } else {
      newItems[index].gstPercent = ''; // Clear GST Percent for Intra-State
    }
    setItems(newItems);
  };

  const generateExcel = async () => {
    const wb = XLSX.utils.book_new();

    // Combine Header and Item Data into a single sheet
    const combinedData = [
      ["INVOICE", invoiceNumber],
      ["INVOICE DATE", invoiceDate],
      ["BILLED TO", billedTo],
      ["DELIVERED TO", deliveredTo],
      ["AGENT", agent],
      [], // Empty row for separation
      ["S.No", "Description of goods", "HSN Code", "Qty/kg/Mtr", "Rate", "Per", "Amount", "GST Percent", "GST Type", "GST Amount", "Amount without GST"],
      ...items.map((item, i) => [
        i + 1,
        item.description,
        item.hsnCode,
        item.qty,
        item.rate,
        item.per,
        item.amount,
        item.gstPercent,
        item.gstType,
        item.gstAmount,
        item.amountWithoutGST,
      ]),
      [], // Empty row for separation
      ["BANK DETAILS"],
      ["AC NO:", "2099102000004992"],
      ["BANK NAME:", "IDBI"],
      ["NAME:", "SRI PRIYA TEX"],
      ["BRANCH:", "SAMALAPURAM"],
      ["IFSC CODE:", "IBKL0002090"],
      ["Amount (in words):"],
      ["For SRI PRIYA TEX,", ""],
      ["Authorized Signatory"]
    ];

    // Add data to the worksheet
    const ws = XLSX.utils.aoa_to_sheet(combinedData);
    XLSX.utils.book_append_sheet(wb, ws, "Invoice");

    // Write workbook to base64 and share it
    const file = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
    const filePath = `${FileSystem.cacheDirectory}${fileName}.xlsx`;
    
    // Send the Excel file via email using the backend API
    axios.post(`http://192.168.39.254:5000/api/send`, { email, filename: `${fileName}.xlsx`, file: file })
      .then(res => console.log(res))
      .catch(err => console.log(err));

    await FileSystem.writeAsStringAsync(filePath, file, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Share the Excel file
    await Sharing.shareAsync(filePath, {
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: `Save ${fileName}.xlsx`,
      UTI: "com.microsoft.excel.xlsx",
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Buttons at the top */}
      <View style={styles.section}>
        <Button title="Add Item" onPress={addItem} />
        <Button title="Generate Excel" onPress={generateExcel} />
      </View>

      {/* Form Fields */}
      <View style={styles.section}>
        <Text>Enter Filename:</Text>
        <TextInput style={styles.input} value={fileName} onChangeText={setFileName} placeholder="Enter Filename" />
      </View>
      <View style={styles.section}>
        <Text>Enter Email:</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter Email" />
      </View>
      <View style={styles.section}>
        <Text>Invoice Number:</Text>
        <TextInput style={styles.input} value={invoiceNumber} onChangeText={setInvoiceNumber} placeholder="Enter Invoice Number" />
      </View>
      <View style={styles.section}>
        <Text>Invoice Date:</Text>
        <TextInput style={styles.input} value={invoiceDate} onChangeText={setInvoiceDate} placeholder="Enter Invoice Date" />
      </View>
      <View style={styles.section}>
        <Text>Billed To:</Text>
        <TextInput style={styles.input} value={billedTo} onChangeText={setBilledTo} placeholder="Enter Billed To" />
      </View>
      <View style={styles.section}>
        <Text>Delivered To:</Text>
        <TextInput style={styles.input} value={deliveredTo} onChangeText={setDeliveredTo} placeholder="Enter Delivered To" />
      </View>
      <View style={styles.section}>
        <Text>Agent:</Text>
        <TextInput style={styles.input} value={agent} onChangeText={setAgent} placeholder="Enter Agent" />
      </View>

      {/* Item Inputs */}
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text>Item {index + 1}</Text>
          <TextInput placeholder="Description" style={styles.input} value={item.description} onChangeText={(text) => updateItem(index, 'description', text)} />
          <TextInput placeholder="HSN Code" style={styles.input} value={item.hsnCode} onChangeText={(text) => updateItem(index, 'hsnCode', text)} />
          <TextInput placeholder="Quantity" style={styles.input} value={item.qty} onChangeText={(text) => updateItem(index, 'qty', text)} keyboardType="numeric" />
          <TextInput placeholder="Rate" style={styles.input} value={item.rate} onChangeText={(text) => updateItem(index, 'rate', text)} keyboardType="numeric" />
          <TextInput placeholder="Per" style={styles.input} value={item.per} onChangeText={(text) => updateItem(index, 'per', text)} />

          {/* GST Type Dropdown */}
          <Picker
            selectedValue={item.gstType}
            onValueChange={(value) => handleGSTTypeChange(index, value)}
          >
            <Picker.Item label="Select GST Type" value="" />
            <Picker.Item label="Intra-State" value="Intra-State" />
            <Picker.Item label="Inter-State" value="Inter-State" />
          </Picker>

          {/* GST Percent Dropdown */}
          {item.gstType === 'Inter-State' ? (
            <TextInput
              placeholder="GST Percent"
              style={styles.input}
              value={item.gstPercent}
              editable={false}
            />
          ) : (
            <Picker
              selectedValue={item.gstPercent}
              onValueChange={(value) => updateItem(index, 'gstPercent', value)}
            >
              <Picker.Item label="Select GST Percent" value="" />
              <Picker.Item label="2%" value="2" />
              <Picker.Item label="3%" value="3" />
              <Picker.Item label="5%" value="5" />
              <Picker.Item label="6%" value="6" />
              <Picker.Item label="8%" value="8" />
              <Picker.Item label="12%" value="12" />
              <Picker.Item label="18%" value="18" />
              <Picker.Item label="24%" value="24" />
            </Picker>
          )}

          <Text>Amount: {item.amount}</Text>
          <Text>GST Amount: {item.gstAmount}</Text>
          <Text>Amount without GST: {item.amountWithoutGST}</Text>

          {/* Remove Item Button */}
          <Button title="Remove Item" onPress={() => removeItem(index)} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  section: { marginVertical: 10 },
  itemContainer: { marginVertical: 15 },
  input: { borderBottomWidth: 1, padding: 5, marginVertical: 5 },
});
