
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';
import YouTubePlayer from './YouTubePlayer';
import Clipboard from '@react-native-clipboard/clipboard';
import * as Haptics from 'expo-haptics';

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
});
