import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  History,
  Clock,
  Download,
  ThumbsUp,
  PlaySquare,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react-native';
import { useAuth } from '@/providers/auth-provider';
import { User } from '@/types/user';
import { showToast } from '@/utils/toster';

export default function LibraryScreen() {
  const { user, logout, refreshToken } = useAuth();

  const libraryOptions = [
    { icon: History, title: 'History', count: 142 },
    { icon: PlaySquare, title: 'Your videos', count: 8 },
    { icon: Clock, title: 'Watch later', count: 23 },
    { icon: Download, title: 'Downloads', count: 5 },
    { icon: ThumbsUp, title: 'Liked videos', count: 89 },
  ];

  const settingsOptions = [
    { icon: Settings, title: 'Settings' },
    { icon: HelpCircle, title: 'Help & feedback' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={{ uri: user?.avatar_url }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.full_name || user?.username || user?.email}</Text>
            {user?.username && (
              <Text style={styles.userEmail}>@{user.username}</Text>
            )}
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.provider && (
              <Text style={styles.subscribers}>Provider: {user.provider}</Text>
            )}
            {user?.is_verified && (
              <Text style={styles.subscribers}>Verified</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.channelButton}>
          <Text style={styles.channelButtonText}>View channel</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          {libraryOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.option}>
              <option.icon size={24} color="#212121" />
              <Text style={styles.optionTitle}>{option.title}</Text>
              <View style={styles.optionRight}>
                {option.count && (
                  <Text style={styles.optionCount}>{option.count}</Text>
                )}
                <ChevronRight size={20} color="#757575" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.option}>
              <option.icon size={24} color="#212121" />
              <Text style={styles.optionTitle}>{option.title}</Text>
              <View style={styles.optionRight}>
                <ChevronRight size={20} color="#757575" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={async () => {
          try {
            await refreshToken();
            showToast('Token refreshed successfully');
          } catch (error: any) {
            let message = 'Refresh token error';
            if (error?.message) message += ': ' + error.message;
            showToast(message);
          }
        }}>
          <Text style={styles.refreshText}>Refresh Token</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut size={24} color="#FF0000" />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
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
    padding: 16,
    gap: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  subscribers: {
    fontSize: 14,
    color: '#757575',
  },
  channelButton: {
    margin: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    alignItems: 'center',
  },
  channelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  section: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionCount: {
    fontSize: 14,
    color: '#757575',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF0000',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 0,
    gap: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  refreshText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
});