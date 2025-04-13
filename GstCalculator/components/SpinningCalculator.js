import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";

const FormulaCalculator = () => {
  const [selectedFormula, setSelectedFormula] = useState("GSM");
  const [inputValues, setInputValues] = useState({});
  const [result, setResult] = useState(null);

  // All formulas
  const formulas = {
    GSM: { func: (weight, area) => weight / area, inputs: ["Weight", "Area"] },
    "Warp Weight": { func: (ends, length, count) => (ends * length) / (count * 1693), inputs: ["Ends", "Length", "Count"] },
    "Weft Weight": { func: (picks, length, count) => (picks * length) / (count * 1693), inputs: ["Picks", "Length", "Count"] },
    "Fabric Cost": { func: (warpCost, weftCost) => warpCost + weftCost, inputs: ["Warp Cost", "Weft Cost"] },
    "Production Rate": { func: (rpm, efficiency) => (rpm * efficiency) / 100, inputs: ["RPM", "Efficiency"] },
    "Cloth Weight": { func: (warpWeight, weftWeight) => warpWeight + weftWeight, inputs: ["Warp Weight", "Weft Weight"] },
    "Yarn Required": { func: (weight, length) => weight / length, inputs: ["Weight", "Length"] },
    "Reed Space": { func: (totalEnds, endsPerInch) => totalEnds / endsPerInch, inputs: ["Total Ends", "Ends Per Inch"] },
    "Picks Per Inch": { func: (totalPicks, fabricLength) => totalPicks / fabricLength, inputs: ["Total Picks", "Fabric Length"] },
    "Ends Per Inch": { func: (totalEnds, fabricWidth) => totalEnds / fabricWidth, inputs: ["Total Ends", "Fabric Width"] },
  };

  // Handle input change
  const handleInputChange = (key, value) => {
    setInputValues((prev) => ({ ...prev, [key]: value }));
  };

  // Perform calculation
  const handleCalculate = () => {
    const formula = formulas[selectedFormula];
    if (!formula) return;

    const values = formula.inputs.map((key) => Number(inputValues[key]));
    if (values.some(isNaN)) {
      setResult("Invalid input");
      return;
    }
    setResult(formula.func(...values).toFixed(2));
  };

  // Clear input fields and result
  const handleClear = () => {
    setInputValues({});
    setResult(null);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Spinning Calculator
      </Text>

      {/* Formula Selection */}
      {Object.keys(formulas).map((formula) => (
        <Button key={formula} title={formula} onPress={() => setSelectedFormula(formula)} />
      ))}

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Selected: {selectedFormula}</Text>

      {/* Input Fields */}
      {formulas[selectedFormula]?.inputs.map((key, index) => (
        <TextInput
          key={index}
          placeholder={`Enter ${key}`}
          keyboardType="numeric"
          value={inputValues[key] || ""}
          onChangeText={(text) => handleInputChange(key, text)}
          style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
        />
      ))}

      <View style={{ marginTop: 10 }}>
        <Button title="Calculate" onPress={handleCalculate} />
      </View>

      {result !== null && (
        <Text style={{ fontSize: 18, marginTop: 10 }}>Result: {result}</Text>
      )}

      <View style={{ marginTop: 10 }}>
        <Button title="Clear" onPress={handleClear} color="red" />
      </View>
    </ScrollView>
  );
};

export default FormulaCalculator;
