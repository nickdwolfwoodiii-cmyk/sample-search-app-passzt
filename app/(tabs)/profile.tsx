
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Linking, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const handleOpenYouTubeAPI = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://console.cloud.google.com/apis/credentials');
  };

  const handleOpenYouTubeGuide = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('https://developers.google.com/youtube/v3/getting-started');
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Settings',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
      )}
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <IconSymbol name="music.note" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Sample Finder</Text>
          <Text style={styles.subtitle}>For Hip-Hop Beat Makers</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Search YouTube for soul, funk, jazz, and other music samples perfect for hip-hop production. 
              Filter by era and genre to find the perfect samples for your beats.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.card}>
            <View style={styles.featureItem}>
              <IconSymbol name="magnifyingglass" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Unlimited YouTube searches</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="play.circle" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Preview videos in-app</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="link" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Copy links to download</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="slider.horizontal.3" size={20} color={colors.primary} />
              <Text style={styles.featureText}>Filter by era and genre</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Setup YouTube API (Optional)</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              For unlimited searches with real-time YouTube results, you can add your own YouTube Data API v3 key.
            </Text>
            <Text style={[styles.cardText, styles.stepText]}>
              1. Visit Google Cloud Console
            </Text>
            <Pressable style={styles.linkButton} onPress={handleOpenYouTubeAPI}>
              <IconSymbol name="link" size={16} color={colors.primary} />
              <Text style={styles.linkButtonText}>Get API Key</Text>
            </Pressable>
            <Text style={[styles.cardText, styles.stepText]}>
              2. Enable YouTube Data API v3
            </Text>
            <Text style={[styles.cardText, styles.stepText]}>
              3. Create credentials (API Key)
            </Text>
            <Text style={[styles.cardText, styles.stepText]}>
              4. Add your key to utils/youtubeApi.ts
            </Text>
            <Pressable style={styles.linkButton} onPress={handleOpenYouTubeGuide}>
              <IconSymbol name="book" size={16} color={colors.secondary} />
              <Text style={[styles.linkButtonText, { color: colors.secondary }]}>
                View Setup Guide
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              • Search for specific songs, artists, or genres
            </Text>
            <Text style={styles.cardText}>
              • Use era filters to find samples from specific decades
            </Text>
            <Text style={styles.cardText}>
              • Preview samples before copying the link
            </Text>
            <Text style={styles.cardText}>
              • Copy YouTube links to use with your favorite download tool
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made for beat makers 🎵</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  stepText: {
    marginTop: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}20`,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },
  footerText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  versionText: {
    fontSize: 14,
    color: colors.textSecondary,
    opacity: 0.6,
  },
});
