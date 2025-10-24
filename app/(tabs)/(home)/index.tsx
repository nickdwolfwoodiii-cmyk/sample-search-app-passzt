
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import SampleCard, { Sample } from '@/components/SampleCard';
import FilterBar from '@/components/FilterBar';
import { SAMPLE_DATA } from '@/data/sampleData';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filteredSamples = useMemo(() => {
    let filtered = SAMPLE_DATA;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (sample) =>
          sample.title.toLowerCase().includes(query) ||
          sample.artist.toLowerCase().includes(query)
      );
    }

    // Filter by era
    if (selectedEra) {
      const startYear = parseInt(selectedEra);
      const endYear = startYear + 9;
      filtered = filtered.filter(
        (sample) => sample.year >= startYear && sample.year <= endYear
      );
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter((sample) => sample.genre === selectedGenre);
    }

    return filtered;
  }, [searchQuery, selectedEra, selectedGenre]);

  const handleClearSearch = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery('');
  };

  const handleClearFilters = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedEra(null);
    setSelectedGenre(null);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedEra || selectedGenre || searchQuery.trim();

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Sample Finder',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
      )}
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search samples or artists..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={handleClearSearch}>
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter Bar */}
        <FilterBar
          selectedEra={selectedEra}
          selectedGenre={selectedGenre}
          onEraChange={setSelectedEra}
          onGenreChange={setSelectedGenre}
        />

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredSamples.length} {filteredSamples.length === 1 ? 'sample' : 'samples'}
          </Text>
          {hasActiveFilters && (
            <Pressable onPress={handleClearFilters} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </Pressable>
          )}
        </View>

        {/* Sample List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.listContainer,
            Platform.OS !== 'ios' && styles.listContainerWithTabBar,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filteredSamples.length > 0 ? (
            filteredSamples.map((sample) => (
              <SampleCard key={sample.id} sample={sample} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="music.note.list" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No samples found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filters
              </Text>
            </View>
          )}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.card,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
