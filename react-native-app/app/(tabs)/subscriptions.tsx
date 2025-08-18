import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, BellOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { mockChannels } from '@/mocks/channels';
import { mockVideos } from '@/mocks/videos';
import { formatViews, formatTimeAgo } from '@/utils/format';

export default function SubscriptionsScreen() {
  const [notifications, setNotifications] = React.useState<{ [key: string]: boolean }>({});

  const toggleNotification = (channelId: string) => {
    setNotifications(prev => ({
      ...prev,
      [channelId]: !prev[channelId]
    }));
  };

  const subscriptionVideos = mockVideos.filter(v => 
    mockChannels.some(c => c.name === v.channelName)
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscriptions</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.channelsSection}>
          <Text style={styles.sectionTitle}>Channels</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.channelsList}
          >
            {mockChannels.map((channel) => (
              <TouchableOpacity 
                key={channel.id}
                style={styles.channelCard}
                onPress={() => router.push(`/channel/${channel.id}`)}
              >
                <Image source={{ uri: channel.avatar }} style={styles.channelAvatar} />
                <Text style={styles.channelName} numberOfLines={1}>{channel.name}</Text>
                <TouchableOpacity 
                  style={styles.notificationButton}
                  onPress={() => toggleNotification(channel.id)}
                >
                  {notifications[channel.id] ? (
                    <Bell size={16} color="#212121" fill="#212121" />
                  ) : (
                    <BellOff size={16} color="#757575" />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.videosSection}>
          <Text style={styles.sectionTitle}>Latest videos</Text>
          {subscriptionVideos.map((video) => (
            <TouchableOpacity 
              key={video.id}
              style={styles.videoCard}
              onPress={() => router.push(`/video/${video.id}`)}
            >
              <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                <Text style={styles.videoMeta}>
                  {video.channelName} • {formatViews(video.views)} • {formatTimeAgo(video.uploadedAt)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  channelsSection: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  channelsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  channelCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  channelAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  channelName: {
    fontSize: 12,
    color: '#212121',
    textAlign: 'center',
    marginBottom: 4,
  },
  notificationButton: {
    padding: 4,
  },
  videosSection: {
    padding: 16,
  },
  videoCard: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  videoThumbnail: {
    width: 160,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'center',
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