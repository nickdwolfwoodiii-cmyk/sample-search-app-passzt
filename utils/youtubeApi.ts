
import { Sample } from '@/components/SampleCard';

// YouTube Data API v3 key - Users should replace this with their own key
// Get a free API key at: https://console.cloud.google.com/apis/credentials
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY_HERE';

interface YouTubeSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    description: string;
  };
}

/**
 * Search YouTube for music samples
 * @param query - Search query string
 * @param era - Optional era filter (e.g., "1970s")
 * @param genre - Optional genre filter (e.g., "Soul")
 * @returns Array of Sample objects
 */
export async function searchYouTube(
  query: string,
  era: string | null = null,
  genre: string | null = null
): Promise<Sample[]> {
  try {
    // If no API key is set, return mock data with a console warning
    if (YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
      console.warn(
        'YouTube API key not configured. Using mock data. Get your free API key at: https://console.cloud.google.com/apis/credentials'
      );
      return getMockSearchResults(query, era, genre);
    }

    // Build the search query
    let searchQuery = query;
    if (genre) {
      searchQuery += ` ${genre}`;
    }
    if (era) {
      const decade = era.substring(0, 3) + '0s';
      searchQuery += ` ${decade}`;
    }

    // Add music-related keywords to improve results
    searchQuery += ' music sample';

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      searchQuery
    )}&type=video&videoCategoryId=10&maxResults=20&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Transform YouTube results to Sample format
    const samples: Sample[] = data.items.map((item: YouTubeSearchResult, index: number) => {
      // Extract year from published date or use current year
      const publishedYear = new Date(item.snippet.publishedAt).getFullYear();
      
      // Try to extract artist and title from the video title
      const titleParts = item.snippet.title.split('-');
      const artist = titleParts.length > 1 ? titleParts[0].trim() : item.snippet.channelTitle;
      const title = titleParts.length > 1 ? titleParts.slice(1).join('-').trim() : item.snippet.title;

      return {
        id: `yt-${item.id.videoId}`,
        title: title,
        artist: artist,
        year: publishedYear,
        genre: genre || 'Unknown',
        videoId: item.id.videoId,
      };
    });

    return samples;
  } catch (error) {
    console.error('Error searching YouTube:', error);
    // Return mock data as fallback
    return getMockSearchResults(query, era, genre);
  }
}

/**
 * Get similar videos based on a video ID
 * @param videoId - The YouTube video ID to find similar videos for
 * @param genre - Optional genre to filter similar videos
 * @returns Array of similar Sample objects
 */
export async function getSimilarVideos(
  videoId: string,
  genre: string | null = null
): Promise<Sample[]> {
  try {
    // If no API key is set, return mock similar videos
    if (YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
      console.warn(
        'YouTube API key not configured. Using mock similar videos.'
      );
      return getMockSimilarVideos(videoId, genre);
    }

    // Use YouTube's related videos endpoint
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&videoCategoryId=10&maxResults=10&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return getMockSimilarVideos(videoId, genre);
    }

    // Transform YouTube results to Sample format
    const samples: Sample[] = data.items.map((item: YouTubeSearchResult) => {
      const publishedYear = new Date(item.snippet.publishedAt).getFullYear();
      const titleParts = item.snippet.title.split('-');
      const artist = titleParts.length > 1 ? titleParts[0].trim() : item.snippet.channelTitle;
      const title = titleParts.length > 1 ? titleParts.slice(1).join('-').trim() : item.snippet.title;

      return {
        id: `yt-similar-${item.id.videoId}`,
        title: title,
        artist: artist,
        year: publishedYear,
        genre: genre || 'Unknown',
        videoId: item.id.videoId,
      };
    });

    return samples;
  } catch (error) {
    console.error('Error getting similar videos:', error);
    return getMockSimilarVideos(videoId, genre);
  }
}

/**
 * Get mock search results when API is not available
 */
function getMockSearchResults(
  query: string,
  era: string | null,
  genre: string | null
): Sample[] {
  // Sample mock data based on common hip-hop samples
  const mockResults: Sample[] = [
    {
      id: 'mock-1',
      title: 'Footsteps in the Dark',
      artist: 'The Isley Brothers',
      year: 1977,
      genre: 'Soul',
      videoId: 'etwIu8-FlGU',
    },
    {
      id: 'mock-2',
      title: 'Summer Madness',
      artist: 'Kool & The Gang',
      year: 1974,
      genre: 'Funk',
      videoId: 'lETP_JNV_Oo',
    },
    {
      id: 'mock-3',
      title: 'Nautilus',
      artist: 'Bob James',
      year: 1974,
      genre: 'Jazz',
      videoId: 'huEtJw7pfLk',
    },
    {
      id: 'mock-4',
      title: 'Apache',
      artist: 'The Incredible Bongo Band',
      year: 1973,
      genre: 'Funk',
      videoId: 'WY-Z6wm6TMQ',
    },
    {
      id: 'mock-5',
      title: 'Impeach the President',
      artist: 'The Honey Drippers',
      year: 1973,
      genre: 'Funk',
      videoId: 'PLJp-Gm5z-o',
    },
    {
      id: 'mock-6',
      title: 'Ashley&apos;s Roachclip',
      artist: 'The Soul Searchers',
      year: 1974,
      genre: 'Funk',
      videoId: 'SjfspM5sDIA',
    },
    {
      id: 'mock-7',
      title: 'Synthetic Substitution',
      artist: 'Melvin Bliss',
      year: 1973,
      genre: 'Funk',
      videoId: 'V5DTznu-9v0',
    },
    {
      id: 'mock-8',
      title: 'Think (About It)',
      artist: 'Lyn Collins',
      year: 1972,
      genre: 'Funk',
      videoId: 'ZyPSw8Ydz-E',
    },
  ];

  // Filter mock results based on query
  let filtered = mockResults;

  if (query) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(
      (sample) =>
        sample.title.toLowerCase().includes(lowerQuery) ||
        sample.artist.toLowerCase().includes(lowerQuery)
    );
  }

  if (era) {
    const startYear = parseInt(era);
    const endYear = startYear + 9;
    filtered = filtered.filter(
      (sample) => sample.year >= startYear && sample.year <= endYear
    );
  }

  if (genre) {
    filtered = filtered.filter((sample) => sample.genre === genre);
  }

  return filtered;
}

/**
 * Get mock similar videos when API is not available
 */
function getMockSimilarVideos(
  videoId: string,
  genre: string | null
): Sample[] {
  const allMockVideos: Sample[] = [
    {
      id: 'similar-1',
      title: 'Between the Sheets',
      artist: 'The Isley Brothers',
      year: 1983,
      genre: 'Soul',
      videoId: 'jlRMTnGLNMI',
    },
    {
      id: 'similar-2',
      title: 'Hollywood Swinging',
      artist: 'Kool & The Gang',
      year: 1973,
      genre: 'Funk',
      videoId: 'Aq344b3hZhM',
    },
    {
      id: 'similar-3',
      title: 'Westchester Lady',
      artist: 'Bob James',
      year: 1976,
      genre: 'Jazz',
      videoId: 'Aq344b3hZhM',
    },
    {
      id: 'similar-4',
      title: 'Funky Drummer',
      artist: 'James Brown',
      year: 1970,
      genre: 'Funk',
      videoId: 'dNP8tbDMZNE',
    },
    {
      id: 'similar-5',
      title: 'Amen Brother',
      artist: 'The Winstons',
      year: 1969,
      genre: 'Funk',
      videoId: '5SaFTm2bcac',
    },
    {
      id: 'similar-6',
      title: 'It&apos;s a New Day',
      artist: 'Skull Snaps',
      year: 1973,
      genre: 'Funk',
      videoId: 'Qy-W3_8IXDM',
    },
  ];

  // Filter by genre if provided
  let filtered = allMockVideos;
  if (genre) {
    filtered = filtered.filter((video) => video.genre === genre);
  }

  // Return a random subset of 3-5 videos
  const count = Math.floor(Math.random() * 3) + 3;
  return filtered.sort(() => Math.random() - 0.5).slice(0, count);
}
