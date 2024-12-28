import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';

const videoLinks = [
  { title: "Complete Process of Textile Manufacturing", subtitle: "How Textile is Working Intro", url: "https://www.youtube.com/watch?v=5nUjGNDImIk" },
  { title: "Types Of Weaving", subtitle: "Explore the different types of weaving techniques", url: "https://www.youtube.com/watch?v=xVLAQyZU7o8" },
  { title: "Warping Process In Textile", subtitle: "Learn about the warping process in textile manufacturing", url: "https://www.youtube.com/watch?v=QlpFDsWipI8" },
  { title: "Weaving Process", subtitle: "Understand the weaving process in textile production", url: "https://www.youtube.com/watch?v=LXqSGIl6JSA" },
  { title: "Wool Production and Processing", subtitle: "Insight into wool production and processing", url: "https://www.youtube.com/watch?v=YwRbyTCqOQY" },
  { title: "Sulzer PowerLoom", subtitle: "Learn about Sulzer power looms and their operation", url: "https://www.youtube.com/watch?v=XZjKfbCgRsI" },
  { title: "Weft Insertion Sulzer", subtitle: "Details about weft insertion on Sulzer looms", url: "https://www.youtube.com/watch?v=6PS-zhrVg6w" },
  { title: "Waterjet", subtitle: "Introduction to waterjet loom technology", url: "https://www.youtube.com/watch?v=SVWkZiHjreI" },
  { title: "Airjet", subtitle: "Airjet loom technology explained", url: "https://www.youtube.com/watch?v=sqchTLyS2W4" },
  { title: "Winding", subtitle: "Learn about the winding process in textiles", url: "https://www.youtube.com/watch?v=1BMWFMSIRjI" },
  // Add more links as needed
];

export default function AboutTheLooms() {
  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  return (
    <ScrollView style={styles.container}>
      {videoLinks.map((link, index) => (
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
