
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import SampleCard, { Sample } from '@/components/SampleCard';
import FilterBar from '@/components/FilterBar';
import { SAMPLE_DATA } from '@/data/sampleData';
import { searchYouTube } from '@/utils/youtubeApi';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Sample[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Use search results if available, otherwise use sample data
  const dataSource = hasSearched ? searchResults : SAMPLE_DATA;

  const filteredSamples = useMemo(() => {
    let filtered = dataSource;

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
  }, [dataSource, selectedEra, selectedGenre]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSearching(true);
    setHasSearched(true);

    try {
      // Build search query with genre and era filters
      let enhancedQuery = searchQuery;
      if (selectedGenre) {
        enhancedQuery += ` ${selectedGenre}`;
      }
      if (selectedEra) {
        const decade = selectedEra.substring(0, 3) + '0s';
        enhancedQuery += ` ${decade}`;
      }

      const results = await searchYouTube(enhancedQuery, selectedEra, selectedGenre);
      setSearchResults(results);

      // Add to search history
      if (!searchHistory.includes(searchQuery)) {
        setSearchHistory((prev) => [searchQuery, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, selectedEra, selectedGenre, searchHistory]);

  const handleClearSearch = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery('');
    setHasSearched(false);
    setSearchResults([]);
  };

  const handleClearFilters = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedEra(null);
    setSelectedGenre(null);
    setSearchQuery('');
    setHasSearched(false);
    setSearchResults([]);
  };

  const handleHistoryItemPress = async (query: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery(query);
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
        {/* Animated Background */}
        <LinearGradient
          colors={[
            `${colors.primary}15`,
            `${colors.background}00`,
            `${colors.secondary}10`,
            `${colors.accent}08`,
          ]}
          locations={[0, 0.3, 0.7, 1]}
          style={styles.backgroundGradient}
        />

        {/* Decorative Elements */}
        <View style={styles.decorativeElements}>
          <View style={[styles.musicNote, styles.musicNote1]}>
            <IconSymbol name="music.note" size={40} color={`${colors.primary}20`} />
          </View>
          <View style={[styles.musicNote, styles.musicNote2]}>
            <IconSymbol name="music.note" size={60} color={`${colors.secondary}15`} />
          </View>
          <View style={[styles.musicNote, styles.musicNote3]}>
            <IconSymbol name="waveform" size={50} color={`${colors.accent}18`} />
          </View>
          <View style={[styles.musicNote, styles.musicNote4]}>
            <IconSymbol name="music.note.list" size={45} color={`${colors.primary}12`} />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search YouTube for samples..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={handleClearSearch}>
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>

          {/* Search Button */}
          <Pressable
            style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <>
                <IconSymbol name="magnifyingglass" size={18} color={colors.text} />
                <Text style={styles.searchButtonText}>Search</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Search History */}
        {!hasSearched && searchHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Recent Searches</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.historyScrollContent}
            >
              {searchHistory.map((query, index) => (
                <Pressable
                  key={index}
                  style={styles.historyItem}
                  onPress={() => handleHistoryItemPress(query)}
                >
                  <IconSymbol name="clock" size={14} color={colors.textSecondary} />
                  <Text style={styles.historyItemText}>{query}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

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
            {hasSearched && ' found'}
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
          {isSearching ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Searching YouTube...</Text>
            </View>
          ) : filteredSamples.length > 0 ? (
            filteredSamples.map((sample) => (
              <SampleCard key={sample.id} sample={sample} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="music.note.list" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>
                {hasSearched ? 'No samples found' : 'Start searching'}
              </Text>
              <Text style={styles.emptyStateText}>
                {hasSearched
                  ? 'Try adjusting your search or filters'
                  : 'Search YouTube for soul, funk, jazz samples and more'}
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
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  decorativeElements: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  musicNote: {
    position: 'absolute',
    opacity: 0.3,
  },
  musicNote1: {
    top: 100,
    left: 20,
    transform: [{ rotate: '-15deg' }],
  },
  musicNote2: {
    top: 250,
    right: 30,
    transform: [{ rotate: '20deg' }],
  },
  musicNote3: {
    bottom: 200,
    left: 40,
    transform: [{ rotate: '10deg' }],
  },
  musicNote4: {
    bottom: 100,
    right: 50,
    transform: [{ rotate: '-25deg' }],
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
    gap: 8,
    zIndex: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    boxShadow: '0px 4px 12px rgba(255, 64, 129, 0.4)',
    elevation: 5,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  historyContainer: {
    paddingVertical: 8,
    zIndex: 10,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  historyScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  historyItemText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
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
    zIndex: 10,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
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
    paddingHorizontal: 20,
  },
});
