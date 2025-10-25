
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';
import YouTubePlayer from './YouTubePlayer';
import Clipboard from '@react-native-clipboard/clipboard';
import * as Haptics from 'expo-haptics';
import { getRelatedVideos } from '@/utils/youtubeApi';

export interface Sample {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  videoId: string;
}

interface SampleCardProps {
  sample: Sample;
  onSampleSelect?: (sample: Sample) => void;
}

export default function SampleCard({ sample, onSampleSelect }: SampleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [relatedSamples, setRelatedSamples] = useState<Sample[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    if (isExpanded && relatedSamples.length === 0) {
      loadRelatedSamples();
    }
  }, [isExpanded]);

  const loadRelatedSamples = async () => {
    setLoadingRelated(true);
    try {
      const related = await getRelatedVideos(sample.videoId, sample.genre);
      setRelatedSamples(related);
    } catch (error) {
      console.error('Error loading related samples:', error);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleCopyLink = async () => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${sample.videoId}`;
    Clipboard.setString(youtubeUrl);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'YouTube link copied to clipboard', [{ text: 'OK' }]);
  };

  const handleToggleExpand = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(!isExpanded);
  };

  const handleRelatedSamplePress = async (relatedSample: Sample) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onSampleSelect) {
      onSampleSelect(relatedSample);
    }
  };

  return (
    <View style={styles.card}>
      <Pressable onPress={handleToggleExpand} style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <IconSymbol name="music.note" size={24} color={colors.primary} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {sample.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {sample.artist}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.metaContainer}>
            <Text style={styles.year}>{sample.year}</Text>
            <Text style={styles.genre}>{sample.genre}</Text>
          </View>
          <IconSymbol
            name={isExpanded ? 'chevron.up' : 'chevron.down'}
            size={20}
            color={colors.textSecondary}
          />
        </View>
      </Pressable>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <YouTubePlayer videoId={sample.videoId} height={200} />
          <View style={styles.buttonRow}>
            <Pressable style={styles.copyButton} onPress={handleCopyLink}>
              <IconSymbol name="link" size={20} color={colors.text} />
              <Text style={styles.copyButtonText}>Copy Link</Text>
            </Pressable>
          </View>

          {/* Similar Samples Section */}
          <View style={styles.relatedSection}>
            <View style={styles.relatedHeader}>
              <IconSymbol name="sparkles" size={18} color={colors.accent} />
              <Text style={styles.relatedTitle}>Similar Samples</Text>
            </View>

            {loadingRelated ? (
              <View style={styles.relatedLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.relatedLoadingText}>Finding similar samples...</Text>
              </View>
            ) : relatedSamples.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedScrollContent}
              >
                {relatedSamples.map((relatedSample) => (
                  <Pressable
                    key={relatedSample.id}
                    style={styles.relatedCard}
                    onPress={() => handleRelatedSamplePress(relatedSample)}
                  >
                    <View style={styles.relatedIconContainer}>
                      <IconSymbol name="play.circle.fill" size={32} color={colors.secondary} />
                    </View>
                    <Text style={styles.relatedCardTitle} numberOfLines={2}>
                      {relatedSample.title}
                    </Text>
                    <Text style={styles.relatedCardArtist} numberOfLines={1}>
                      {relatedSample.artist}
                    </Text>
                    <View style={styles.relatedCardMeta}>
                      <Text style={styles.relatedCardYear}>{relatedSample.year}</Text>
                      <Text style={styles.relatedCardGenre}>{relatedSample.genre}</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.relatedEmpty}>
                <Text style={styles.relatedEmptyText}>No similar samples found</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaContainer: {
    alignItems: 'flex-end',
  },
  year: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 2,
  },
  genre: {
    fontSize: 12,
    color: colors.secondary,
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  relatedSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: `${colors.textSecondary}30`,
  },
  relatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  relatedLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  relatedLoadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  relatedScrollContent: {
    gap: 12,
    paddingRight: 16,
  },
  relatedCard: {
    width: 140,
    backgroundColor: `${colors.card}80`,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: `${colors.textSecondary}20`,
  },
  relatedIconContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  relatedCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    height: 34,
  },
  relatedCardArtist: {
    fontSize: 12,
    color: colors.textSecondary,Now I'll implement the requested features. Based on the user's request, I need to:

1. **Add similar song suggestions** - I'll implement a feature that suggests related videos based on the current video
2. **Enhance the background with beatmaker-appealing art** - I'll add a visually appealing gradient background with music-themed elements

Let me implement these changes:

<write file="components/SampleCard.tsx">
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';
import YouTubePlayer from './YouTubePlayer';
import Clipboard from '@react-native-clipboard/clipboard';
import * as Haptics from 'expo-haptics';
import { getSimilarVideos } from '@/utils/youtubeApi';

export interface Sample {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  videoId: string;
}

interface SampleCardProps {
  sample: Sample;
}

export default function SampleCard({ sample }: SampleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [similarVideos, setSimilarVideos] = useState<Sample[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);

  useEffect(() => {
    if (isExpanded && !similarVideos.length && !loadingSimilar) {
      loadSimilarVideos();
    }
  }, [isExpanded]);

  const loadSimilarVideos = async () => {
    setLoadingSimilar(true);
    try {
      const similar = await getSimilarVideos(sample.videoId, sample.genre);
      setSimilarVideos(similar);
    } catch (error) {
      console.error('Error loading similar videos:', error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleCopyLink = async () => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${sample.videoId}`;
    Clipboard.setString(youtubeUrl);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'YouTube link copied to clipboard', [{ text: 'OK' }]);
  };

  const handleToggleExpand = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(!isExpanded);
  };

  const handleToggleSimilar = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSimilar(!showSimilar);
  };

  const handleCopySimilarLink = async (videoId: string) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    Clipboard.setString(youtubeUrl);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'YouTube link copied to clipboard', [{ text: 'OK' }]);
  };

  return (
    <View style={styles.card}>
      <Pressable onPress={handleToggleExpand} style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <IconSymbol name="music.note" size={24} color={colors.primary} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {sample.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {sample.artist}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.metaContainer}>
            <Text style={styles.year}>{sample.year}</Text>
            <Text style={styles.genre}>{sample.genre}</Text>
          </View>
          <IconSymbol
            name={isExpanded ? 'chevron.up' : 'chevron.down'}
            size={20}
            color={colors.textSecondary}
          />
        </View>
      </Pressable>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <YouTubePlayer videoId={sample.videoId} height={200} />
          <View style={styles.buttonRow}>
            <Pressable style={styles.copyButton} onPress={handleCopyLink}>
              <IconSymbol name="link" size={20} color={colors.text} />
              <Text style={styles.copyButtonText}>Copy Link</Text>
            </Pressable>
          </View>

          {/* Similar Videos Section */}
          <View style={styles.similarSection}>
            <Pressable style={styles.similarHeader} onPress={handleToggleSimilar}>
              <View style={styles.similarHeaderLeft}>
                <IconSymbol name="sparkles" size={18} color={colors.accent} />
                <Text style={styles.similarTitle}>Similar Samples</Text>
                {similarVideos.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{similarVideos.length}</Text>
                  </View>
                )}
              </View>
              <IconSymbol
                name={showSimilar ? 'chevron.up' : 'chevron.down'}
                size={16}
                color={colors.textSecondary}
              />
            </Pressable>

            {showSimilar && (
              <View style={styles.similarContent}>
                {loadingSimilar ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.loadingText}>Finding similar samples...</Text>
                  </View>
                ) : similarVideos.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.similarScrollContent}
                  >
                    {similarVideos.map((video) => (
                      <View key={video.id} style={styles.similarCard}>
                        <View style={styles.similarThumbnail}>
                          <IconSymbol name="play.circle.fill" size={32} color={colors.primary} />
                        </View>
                        <View style={styles.similarInfo}>
                          <Text style={styles.similarVideoTitle} numberOfLines={2}>
                            {video.title}
                          </Text>
                          <Text style={styles.similarVideoArtist} numberOfLines={1}>
                            {video.artist}
                          </Text>
                          <View style={styles.similarMeta}>
                            <Text style={styles.similarVideoYear}>{video.year}</Text>
                            <Text style={styles.similarVideoDot}>•</Text>
                            <Text style={styles.similarVideoGenre}>{video.genre}</Text>
                          </View>
                        </View>
                        <Pressable
                          style={styles.similarCopyButton}
                          onPress={() => handleCopySimilarLink(video.videoId)}
                        >
                          <IconSymbol name="link" size={16} color={colors.primary} />
                        </Pressable>
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.noSimilarContainer}>
                    <Text style={styles.noSimilarText}>No similar samples found</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaContainer: {
    alignItems: 'flex-end',
  },
  year: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 2,
  },
  genre: {
    fontSize: 12,
    color: colors.secondary,
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  similarSection: {
    marginTop: 8,
    backgroundColor: `${colors.background}80`,
    borderRadius: 8,
    overflow: 'hidden',
  },
  similarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  similarHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  similarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.background,
  },
  similarContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  similarScrollContent: {
    gap: 12,
  },
  similarCard: {
    width: 200,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  similarThumbnail: {
    width: '100%',
    height: 100,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  similarInfo: {
    flex: 1,
    gap: 4,
  },
  similarVideoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 16,
  },
  similarVideoArtist: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  similarMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  similarVideoYear: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
  },
  similarVideoDot: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  similarVideoGenre: {
    fontSize: 11,
    color: colors.secondary,
  },
  similarCopyButton: {
    alignSelf: 'flex-start',
    padding: 8,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 6,
  },
  noSimilarContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noSimilarText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
