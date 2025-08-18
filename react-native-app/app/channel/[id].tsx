import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Bell, BellOff } from 'lucide-react-native';
import { mockChannels } from '@/mocks/channels';
import { mockVideos } from '@/mocks/videos';
import { formatViews, formatTimeAgo } from '@/utils/format';

const { width } = Dimensions.get('window');

export default function ChannelScreen() {
  const { id } = useLocalSearchParams();
  const [subscribed, setSubscribed] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('videos');

  const channel = mockChannels.find(c => c.id === id) || mockChannels[0];
  const channelVideos = mockVideos.filter(v => v.channelName === channel.name);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{channel.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: channel.banner }} style={styles.banner} />
        
        <View style={styles.channelInfo}>
          <Image source={{ uri: channel.avatar }} style={styles.avatar} />
          <Text style={styles.channelName}>{channel.name}</Text>
          <Text style={styles.handle}>@{channel.handle}</Text>
          <Text style={styles.stats}>
            {channel.subscribers} subscribers • {channel.videos} videos
          </Text>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.subscribeButton, subscribed && styles.subscribedButton]}
              onPress={() => setSubscribed(!subscribed)}
            >
              <Text style={[styles.subscribeText, subscribed && styles.subscribedText]}>
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </Text>
            </TouchableOpacity>
            
            {subscribed && (
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => setNotifications(!notifications)}
              >
                {notifications ? (
                  <Bell size={20} color="#212121" fill="#212121" />
                ) : (
                  <BellOff size={20} color="#757575" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'videos' && styles.tabActive]}
            onPress={() => setActiveTab('videos')}
          >
            <Text style={[styles.tabText, activeTab === 'videos' && styles.tabTextActive]}>
              Videos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'shorts' && styles.tabActive]}
            onPress={() => setActiveTab('shorts')}
          >
            <Text style={[styles.tabText, activeTab === 'shorts' && styles.tabTextActive]}>
              Shorts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'about' && styles.tabActive]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
              About
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'videos' && (
          <View style={styles.videosGrid}>
            {channelVideos.map((video) => (
              <TouchableOpacity 
                key={video.id}
                style={styles.videoCard}
                onPress={() => router.push(`/video/${video.id}`)}
              >
                <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                <Text style={styles.videoMeta}>
                  {formatViews(video.views)} • {formatTimeAgo(video.uploadedAt)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'about' && (
          <View style={styles.about}>
            <Text style={styles.aboutText}>{channel.description}</Text>
            <View style={styles.aboutStats}>
              <Text style={styles.statLabel}>Joined</Text>
              <Text style={styles.statValue}>{channel.joined}</Text>
            </View>
            <View style={styles.aboutStats}>
              <Text style={styles.statLabel}>Total views</Text>
              <Text style={styles.statValue}>{channel.totalViews}</Text>
            </View>
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  banner: {
    width: width,
    height: width * 0.3,
    backgroundColor: '#F5F5F5',
  },
  channelInfo: {
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: -40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#F5F5F5',
  },
  channelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 12,
  },
  handle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  stats: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  subscribeButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#FF0000',
    borderRadius: 20,
  },
  subscribedButton: {
    backgroundColor: '#F5F5F5',
  },
  subscribeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subscribedText: {
    color: '#212121',
  },
  notificationButton: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#212121',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
  tabTextActive: {
    color: '#212121',
    fontWeight: '600',
  },
  videosGrid: {
    padding: 16,
  },
  videoCard: {
    marginBottom: 20,
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
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
  },
  about: {
    padding: 16,
  },
  aboutText: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
    marginBottom: 24,
  },
  aboutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
});