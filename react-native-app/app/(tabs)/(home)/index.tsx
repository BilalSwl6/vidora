import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { mockVideos, mockCategories } from '@/mocks/videos';
import { formatViews, formatTimeAgo } from '@/utils/format';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredVideos = selectedCategory === 'All' 
    ? mockVideos 
    : mockVideos.filter(v => v.category === selectedCategory);

  const renderVideo = ({ item }: { item: typeof mockVideos[0] }) => (
    <TouchableOpacity 
      style={styles.videoCard}
      onPress={() => router.push(`/video/${item.id}`)}
      testID={`video-${item.id}`}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.duration}>
        <Text style={styles.durationText}>{item.duration}</Text>
      </View>
      <View style={styles.videoInfo}>
        <Image source={{ uri: item.channelAvatar }} style={styles.channelAvatar} />
        <View style={styles.videoDetails}>
          <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.videoMeta}>
            {item.channelName} • {formatViews(item.views)} • {formatTimeAgo(item.uploadedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        contentContainerStyle={styles.categoriesContent}
      >
        {mockCategories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredVideos}
        renderItem={renderVideo}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.videoList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  categories: {
    maxHeight: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#212121',
  },
  categoryText: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  videoList: {
    paddingBottom: 20,
  },
  videoCard: {
    marginBottom: 16,
  },
  thumbnail: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#F5F5F5',
  },
  duration: {
    position: 'absolute',
    bottom: 80,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  videoInfo: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  channelAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
  },
  videoDetails: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
    lineHeight: 18,
  },
  videoMeta: {
    fontSize: 12,
    color: '#757575',
    lineHeight: 16,
  },
});