import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  ViewToken
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Share2, MoreVertical, Music } from 'lucide-react-native';
import { mockShorts } from '@/mocks/shorts';
import { formatViews } from '@/utils/format';

const { width, height } = Dimensions.get('window');

interface ShortItemProps {
  item: typeof mockShorts[0];
  isActive: boolean;
}

function ShortItem({ item, isActive }: ShortItemProps) {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.shortContainer}>
      <Image source={{ uri: item.thumbnail }} style={styles.video} />
      
      <View style={styles.overlay}>
        <View style={styles.bottomInfo}>
          <View style={styles.userInfo}>
            <Image source={{ uri: item.channelAvatar }} style={styles.avatar} />
            <Text style={styles.channelName}>@{item.channelName}</Text>
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          
          {item.music && (
            <View style={styles.musicInfo}>
              <Music size={14} color="#FFFFFF" />
              <Text style={styles.musicText}>{item.music}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setLiked(!liked)}
          >
            <Heart 
              size={28} 
              color="#FFFFFF" 
              fill={liked ? '#FF0000' : 'transparent'}
            />
            <Text style={styles.actionText}>{formatViews(item.likes)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={28} color="#FFFFFF" />
            <Text style={styles.actionText}>{formatViews(item.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={28} color="#FFFFFF" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MoreVertical size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ShortsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={styles.headerTitle}>Shorts</Text>
      </SafeAreaView>
      
      <FlatList
        data={mockShorts}
        renderItem={({ item, index }) => (
          <ShortItem item={item} isActive={index === activeIndex} />
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={height - 60}
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  shortContainer: {
    width: width,
    height: height - 60,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 80,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  channelName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  subscribeButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  musicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  musicText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  actions: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    gap: 24,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
});