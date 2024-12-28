import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';

const Links = [
  { title: "Cotton Price Prediction Per KG", subtitle: "Cotton Price Prediction using ML", url: "https://cotton-model-latest.onrender.com/" },
];

export default function AboutTheLooms() {
  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  return (
    <ScrollView style={styles.container}>
      {Links.map((link, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => openLink(link.url)}
        >
          <Text style={styles.title}>{link.title}</Text>
          <Text style={styles.subtitle}>{link.subtitle}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#121212',
  },
  card: {
    backgroundColor: '#4682B4',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#CCCCCC',
    fontSize: 14,
    marginTop: 5, // Added margin for spacing between title and subtitle
  },
});
