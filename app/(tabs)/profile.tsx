
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Linking, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
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
            title: 'Setup & Info',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
      )}
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <IconSymbol name="music.note" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Sample Finder</Text>
          <Text style={styles.subtitle}>For Hip-Hop Beat Makers</Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol name="magnifyingglass" size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Unlimited YouTube Search</Text>
              <Text style={styles.featureText}>
                Search for soul, funk, jazz, and other music samples directly from YouTube
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol name="play.circle.fill" size={24} color={colors.secondary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Preview Videos</Text>
              <Text style={styles.featureText}>
                Play YouTube videos directly in the app to preview samples before downloading
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol name="sparkles" size={24} color={colors.accent} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Similar Samples</Text>
              <Text style={styles.featureText}>
                Discover related samples and similar songs based on your selections
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol name="slider.horizontal.3" size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Filter by Era & Genre</Text>
              <Text style={styles.featureText}>
                Refine your search by decade (60s-2020s) and genre (Soul, Funk, Jazz, etc.)
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <IconSymbol name="link" size={24} color={colors.secondary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Copy Links</Text>
              <Text style={styles.featureText}>
                Easily copy YouTube links to download samples with your preferred tool
              </Text>
            </View>
          </View>
        </View>

        {/* Setup Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YouTube API Setup</Text>
          <View style={styles.infoCard}>
            <IconSymbol name="info.circle" size={24} color={colors.accent} />
            <Text style={styles.infoText}>
              To enable real YouTube search, you need a free YouTube Data API v3 key.
            </Text>
          </View>

          <View style={styles.stepsCard}>
            <Text style={styles.stepsTitle}>Setup Steps:</Text>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1.</Text>
              <Text style={styles.stepText}>
                Go to Google Cloud Console and create a new project
              </Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>2.</Text>
              <Text style={styles.stepText}>
                Enable the YouTube Data API v3 for your project
              </Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>3.</Text>
              <Text style={styles.stepText}>
                Create credentials (API key) for your project
              </Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>4.</Text>
              <Text style={styles.stepText}>
                Copy the API key and paste it in utils/youtubeApi.ts
              </Text>
            </View>
          </View>

          <Pressable style={styles.linkButton} onPress={handleOpenYouTubeAPI}>
            <IconSymbol name="link" size={20} color={colors.text} />
            <Text style={styles.linkButtonText}>Get API Key</Text>
            <IconSymbol name="arrow.up.right" size={16} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.linkButtonSecondary} onPress={handleOpenYouTubeGuide}>
            <IconSymbol name="book" size={20} color={colors.primary} />
            <Text style={styles.linkButtonSecondaryText}>View Setup Guide</Text>
            <IconSymbol name="arrow.up.right" size={16} color={colors.primary} />
          </Pressable>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Beat Makers</Text>
          <View style={styles.tipCard}>
            <IconSymbol name="lightbulb" size={20} color={colors.accent} />
            <Text style={styles.tipText}>
              Search for specific instruments like &quot;drum break&quot; or &quot;bass line&quot;
            </Text>
          </View>
          <View style={styles.tipCard}>
            <IconSymbol name="lightbulb" size={20} color={colors.accent} />
            <Text style={styles.tipText}>
              Use era filters to find authentic vintage sounds from the 60s-80s
            </Text>
          </View>
          <View style={styles.tipCard}>
            <IconSymbol name="lightbulb" size={20} color={colors.accent} />
            <Text style={styles.tipText}>
              Check similar samples to discover hidden gems and lesser-known tracks
            </Text>
          </View>
          <View style={styles.tipCard}>
            <IconSymbol name="lightbulb" size={20} color={colors.accent} />
            <Text style={styles.tipText}>
              Combine genre and era filters for more specific results
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made for beat makers, by beat makers</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
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
    paddingBottom: Platform.OS !== 'ios' ? 100 : 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.accent}20`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  stepsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    width: 20,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(255, 64, 129, 0.4)',
    elevation: 5,
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  linkButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  linkButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    gap: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: `${colors.textSecondary}30`,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  version: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
