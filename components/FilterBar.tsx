
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

export interface FilterBarProps {
  selectedEra: string | null;
  selectedGenre: string | null;
  onEraChange: (era: string | null) => void;
  onGenreChange: (genre: string | null) => void;
}

const ERAS = [
  { label: 'All', value: null },
  { label: '60s', value: '1960s' },
  { label: '70s', value: '1970s' },
  { label: '80s', value: '1980s' },
  { label: '90s', value: '1990s' },
  { label: '00s', value: '2000s' },
  { label: '10s', value: '2010s' },
];

const GENRES = [
  { label: 'All', value: null },
  { label: 'Soul', value: 'Soul' },
  { label: 'Funk', value: 'Funk' },
  { label: 'Jazz', value: 'Jazz' },
  { label: 'Blues', value: 'Blues' },
  { label: 'R&B', value: 'R&B' },
  { label: 'Rock', value: 'Rock' },
];

export default function FilterBar({
  selectedEra,
  selectedGenre,
  onEraChange,
  onGenreChange,
}: FilterBarProps) {
  const handleEraPress = async (value: string | null) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEraChange(value);
  };

  const handleGenrePress = async (value: string | null) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onGenreChange(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Era</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {ERAS.map((era) => (
            <Pressable
              key={era.label}
              style={[
                styles.filterButton,
                selectedEra === era.value && styles.filterButtonActive,
              ]}
              onPress={() => handleEraPress(era.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedEra === era.value && styles.filterButtonTextActive,
                ]}
              >
                {era.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Genre</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {GENRES.map((genre) => (
            <Pressable
              key={genre.label}
              style={[
                styles.filterButton,
                selectedGenre === genre.value && styles.filterButtonActive,
              ]}
              onPress={() => handleGenrePress(genre.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedGenre === genre.value && styles.filterButtonTextActive,
                ]}
              >
                {genre.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    gap: 12,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.textSecondary + '40',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.text,
  },
});
