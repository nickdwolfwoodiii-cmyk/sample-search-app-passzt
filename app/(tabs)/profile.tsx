
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Profile',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
      )}
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
            </View>
            <Text style={styles.name}>Beat Maker</Text>
            <Text style={styles.subtitle}>Hip-Hop Producer</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                Welcome to Sample Finder - your ultimate tool for discovering classic soul, funk, jazz, and R&B samples for hip-hop production.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.card}>
              <View style={styles.featureItem}>
                <IconSymbol name="magnifyingglass" size={24} color={colors.secondary} />
                <Text style={styles.featureText}>Search thousands of classic samples</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="music.note" size={24} color={colors.secondary} />
                <Text style={styles.featureText}>Preview samples directly from YouTube</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="link" size={24} color={colors.secondary} />
                <Text style={styles.featureText}>Copy YouTube links instantly</Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="slider.horizontal.3" size={24} color={colors.secondary} />
                <Text style={styles.featureText}>Filter by era and genre</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                • Tap on any sample card to expand and preview the track{'\n'}
                • Use the era filters to find samples from specific decades{'\n'}
                • Filter by genre to narrow down your search{'\n'}
                • Copy the YouTube link to save samples for later
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
});
