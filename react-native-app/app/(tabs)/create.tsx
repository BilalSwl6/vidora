import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, Radio, Upload, Smartphone } from 'lucide-react-native';

export default function CreateScreen() {
  const options = [
    { icon: Video, title: 'Create a Short', subtitle: 'Record a vertical video' },
    { icon: Upload, title: 'Upload a video', subtitle: 'Post a video from your gallery' },
    { icon: Radio, title: 'Go live', subtitle: 'Start a live stream' },
    { icon: Smartphone, title: 'Create a post', subtitle: 'Share text and images' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Create</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {options.map((option, index) => (
          <TouchableOpacity key={index} style={styles.option}>
            <View style={styles.iconContainer}>
              <option.icon size={24} color="#212121" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 12,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
});