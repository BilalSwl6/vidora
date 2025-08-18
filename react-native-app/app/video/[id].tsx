import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Download,
  MoreHorizontal,
  ChevronDown,
  X
} from 'lucide-react-native';
import { mockVideos } from '@/mocks/videos';
import { mockComments } from '@/mocks/comments';
import { formatViews, formatTimeAgo } from '@/utils/format';

const { width } = Dimensions.get('window');

export default function VideoScreen() {
  const { id } = useLocalSearchParams();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [comment, setComment] = useState('');

  const video = mockVideos.find(v => v.id === id);
  const relatedVideos = mockVideos.filter(v => v.id !== id).slice(0, 5);

  if (!video) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.videoContainer}>
            <Image source={{ uri: video.thumbnail }} style={styles.video} />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{video.title}</Text>
            
            <TouchableOpacity 
              style={styles.metaContainer}
              onPress={() => setShowDescription(!showDescription)}
            >
              <Text style={styles.meta}>
                {formatViews(video.views)} views • {formatTimeAgo(video.uploadedAt)}
              </Text>
              <ChevronDown 
                size={20} 
                color="#757575" 
                style={{ transform: [{ rotate: showDescription ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>

            {showDescription && (
              <View style={styles.description}>
                <Text style={styles.descriptionText}>{video.description}</Text>
              </View>
            )}

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.actions}
              contentContainerStyle={styles.actionsContent}
            >
              <TouchableOpacity 
                style={[styles.actionButton, liked && styles.actionButtonActive]}
                onPress={() => {
                  setLiked(!liked);
                  setDisliked(false);
                }}
              >
                <ThumbsUp size={20} color={liked ? '#FFFFFF' : '#212121'} />
                <Text style={[styles.actionText, liked && styles.actionTextActive]}>
                  {formatViews(video.likes + (liked ? 1 : 0))}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, disliked && styles.actionButtonActive]}
                onPress={() => {
                  setDisliked(!disliked);
                  setLiked(false);
                }}
              >
                <ThumbsDown size={20} color={disliked ? '#FFFFFF' : '#212121'} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Share2 size={20} color="#212121" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Download size={20} color="#212121" />
                <Text style={styles.actionText}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <MoreHorizontal size={20} color="#212121" />
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.channelSection}>
              <TouchableOpacity 
                style={styles.channelInfo}
                onPress={() => router.push(`/channel/${video.channelName}`)}
              >
                <Image source={{ uri: video.channelAvatar }} style={styles.channelAvatar} />
                <View style={styles.channelDetails}>
                  <Text style={styles.channelName}>{video.channelName}</Text>
                  <Text style={styles.subscriberCount}>1.2M subscribers</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.subscribeButton, subscribed && styles.subscribedButton]}
                onPress={() => setSubscribed(!subscribed)}
              >
                <Text style={[styles.subscribeText, subscribed && styles.subscribedText]}>
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.commentsSection}>
              <Text style={styles.sectionTitle}>Comments • {mockComments.length}</Text>
              
              <View style={styles.addComment}>
                <Image 
                  source={{ uri: 'https://i.pravatar.cc/150?img=3' }} 
                  style={styles.commentAvatar} 
                />
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  placeholderTextColor="#757575"
                  value={comment}
                  onChangeText={setComment}
                />
              </View>

              {mockComments.map((comment) => (
                <View key={comment.id} style={styles.comment}>
                  <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentTime}>{formatTimeAgo(comment.timestamp)}</Text>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <View style={styles.commentActions}>
                      <TouchableOpacity style={styles.commentAction}>
                        <ThumbsUp size={14} color="#757575" />
                        <Text style={styles.commentActionText}>{comment.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.commentAction}>
                        <ThumbsDown size={14} color="#757575" />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Text style={styles.replyButton}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>Related videos</Text>
              {relatedVideos.map((video) => (
                <TouchableOpacity 
                  key={video.id}
                  style={styles.relatedVideo}
                  onPress={() => router.push(`/video/${video.id}`)}
                >
                  <Image source={{ uri: video.thumbnail }} style={styles.relatedThumbnail} />
                  <View style={styles.relatedInfo}>
                    <Text style={styles.relatedTitle} numberOfLines={2}>{video.title}</Text>
                    <Text style={styles.relatedMeta}>
                      {video.channelName} • {formatViews(video.views)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  videoContainer: {
    position: 'relative',
  },
  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000000',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    color: '#757575',
  },
  description: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
  },
  actions: {
    marginBottom: 16,
  },
  actionsContent: {
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    gap: 6,
  },
  actionButtonActive: {
    backgroundColor: '#212121',
  },
  actionText: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  actionTextActive: {
    color: '#FFFFFF',
  },
  channelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  channelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  channelDetails: {
    flex: 1,
  },
  channelName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  subscriberCount: {
    fontSize: 12,
    color: '#757575',
  },
  subscribeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  commentsSection: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 16,
  },
  addComment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#212121',
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
  },
  commentTime: {
    fontSize: 12,
    color: '#757575',
  },
  commentText: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 12,
    color: '#757575',
  },
  replyButton: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
  },
  relatedSection: {
    paddingVertical: 16,
  },
  relatedVideo: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  relatedThumbnail: {
    width: 160,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  relatedInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
    lineHeight: 18,
  },
  relatedMeta: {
    fontSize: 12,
    color: '#757575',
  },
});