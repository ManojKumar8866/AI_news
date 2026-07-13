import { NewsArticle, NewsResponse, SearchParams, AIAnalysis } from '@/types/news';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'demo_key';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
// Use proxy for CORS in development
const PROXY_URL = 'https://api.allorigins.win/raw?url=';
const USE_PROXY = NEWS_API_KEY === 'demo_key' || import.meta.env.DEV;

// Define interface for raw API article response
interface RawArticle {
  url?: string;
  title?: string;
  description?: string;
  content?: string;
  urlToImage?: string;
  publishedAt?: string;
  source?: {
    id?: string;
    name?: string;
  };
  author?: string;
  [key: string]: unknown;
}

// Fallback news data for demo purposes
const DEMO_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'AI Revolution: Major Breakthrough in Machine Learning',
    description: 'Scientists achieve unprecedented results in artificial intelligence research, paving the way for next-generation applications.',
    content: 'In a groundbreaking development, researchers have announced a major breakthrough in machine learning that could revolutionize how we interact with artificial intelligence...',
    url: 'https://www.bbc.com/news/technology',
    urlToImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    publishedAt: new Date().toISOString(),
    source: { id: 'tech-news', name: 'Tech News Daily' },
    author: 'Dr. Sarah Johnson',
    category: 'technology',
  },
  {
    id: '2',
    title: 'Global Climate Summit Reaches Historic Agreement',
    description: 'World leaders unite on comprehensive climate action plan with ambitious targets for carbon reduction.',
    content: 'The Global Climate Summit concluded today with a historic agreement that sees 195 countries commit to unprecedented climate action...',
    url: 'https://www.bbc.com/news/world',
    urlToImage: '/images/climateaction.jpg',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: { id: 'world-news', name: 'Global News Network' },
    author: 'Michael Chen',
    category: 'politics',
  },
  {
    id: '3',
    title: 'Stock Market Reaches All-Time High Amid Tech Rally',
    description: 'Major indices surge as technology stocks lead unprecedented market gains in volatile trading session.',
    content: 'The stock market closed at record highs today as technology stocks surged, with the NASDAQ gaining 3.5% in a single session...',
    url: 'https://www.bbc.com/news/business',
    urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: { id: 'business-wire', name: 'Business Wire' },
    author: 'Jennifer Rodriguez',
    category: 'business',
  },
  {
    id: '4',
    title: 'Championship Finals Set as Underdogs Advance',
    description: 'Surprising upsets in semifinals lead to unexpected championship matchup that has fans buzzing.',
    content: 'In a stunning turn of events, two underdog teams have advanced to the championship finals after defeating heavily favored opponents...',
    url: 'https://www.espn.com',
    urlToImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: { id: 'sports-central', name: 'Sports Central' },
    author: 'Alex Thompson',
    category: 'sports',
  },
  {
    id: '5',
    title: 'Breakthrough Medical Treatment Shows Promise',
    description: 'Clinical trials reveal significant success rates for new treatment targeting rare diseases.',
    content: 'A revolutionary medical treatment has shown remarkable results in clinical trials, offering hope to patients with rare diseases...',
    url: 'https://www.bbc.com/news/health',
    urlToImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    source: { id: 'health-today', name: 'Health Today' },
    author: 'Dr. Maria Gonzalez',
    category: 'health',
  },
];

class NewsApiService {
  private async fetchWithErrorHandling(url: string): Promise<NewsResponse> {
    try {
      // Use proxy for CORS issues or demo key
      const fetchUrl = USE_PROXY ? `${PROXY_URL}${encodeURIComponent(url)}` : url;
      
      const response = await fetch(fetchUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn(`API request failed with status ${response.status}. Using demo data.`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid API response format');
      }
      
      // Handle different response formats
      if (data.status === 'error') {
        throw new Error(data.message || 'API returned error status');
      }
      
      return {
        status: data.status || 'ok',
        totalResults: data.totalResults || data.articles?.length || 0,
        articles: data.articles || [],
      };
    } catch (error) {
      console.error('API fetch error:', error);
      console.info('Falling back to demo news data');
      
      // Return demo data on API failure
      return {
        status: 'ok',
        totalResults: DEMO_NEWS.length,
        articles: DEMO_NEWS,
      };
    }
  }

  private mapRawArticleToNewsArticle(article: RawArticle, category?: string): NewsArticle {
    return {
      id: article.url || `article-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title || 'No title available',
      description: article.description || 'No description available',
      content: article.content || article.description || 'No content available',
      url: article.url || '#',
      urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: article.source || { id: 'unknown', name: 'Unknown Source' },
      author: article.author || 'Unknown Author',
      category: category || 'general',
    };
  }

  async getTopHeadlines(params: SearchParams = {}): Promise<NewsResponse> {
    // If using demo key, return demo data directly
    if (NEWS_API_KEY === 'demo_key') {
      console.info('Using demo API key - returning demo data');
      return {
        status: 'ok',
        totalResults: DEMO_NEWS.length,
        articles: DEMO_NEWS,
      };
    }

    const queryParams = new URLSearchParams();
    queryParams.append('apiKey', NEWS_API_KEY);
    queryParams.append('country', 'us');
    queryParams.append('pageSize', String(params.pageSize || 20));
    
    // Only add valid parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const url = `${NEWS_API_BASE_URL}/top-headlines?${queryParams}`;
    const data = await this.fetchWithErrorHandling(url);
    
    return {
      ...data,
      articles: (data.articles || []).map((article: RawArticle) => 
        this.mapRawArticleToNewsArticle(article, params.category)
      ),
    };
  }

  async searchNews(params: SearchParams): Promise<NewsResponse> {
    // If using demo key, filter demo data by search query
    if (NEWS_API_KEY === 'demo_key') {
      console.info('Using demo API key - filtering demo data');
      const query = params.q?.toLowerCase() || '';
      const filteredArticles = DEMO_NEWS.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      );
      
      return {
        status: 'ok',
        totalResults: filteredArticles.length,
        articles: filteredArticles,
      };
    }

    const queryParams = new URLSearchParams();
    queryParams.append('apiKey', NEWS_API_KEY);
    queryParams.append('pageSize', String(params.pageSize || 20));
    queryParams.append('sortBy', params.sortBy || 'publishedAt');
    
    // Only add valid parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const url = `${NEWS_API_BASE_URL}/everything?${queryParams}`;
    const data = await this.fetchWithErrorHandling(url);
    
    return {
      ...data,
      articles: (data.articles || []).map((article: RawArticle) => 
        this.mapRawArticleToNewsArticle(article, params.category)
      ),
    };
  }

  async getNewsByCategory(category: string): Promise<NewsResponse> {
    return this.getTopHeadlines({ category });
  }

  // AI-powered content analysis
  generateAIAnalysis(article: NewsArticle): AIAnalysis {
    const wordCount = article.content?.split(' ').length || article.description?.split(' ').length || 100;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    // Simple sentiment analysis based on keywords
    const positiveWords = ['breakthrough', 'success', 'growth', 'achievement', 'victory', 'progress', 'innovation'];
    const negativeWords = ['crisis', 'decline', 'problem', 'failure', 'loss', 'threat', 'concern'];
    
    const content = (article.title + ' ' + article.description).toLowerCase();
    const positiveCount = positiveWords.filter(word => content.includes(word)).length;
    const negativeCount = negativeWords.filter(word => content.includes(word)).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    // Generate summary (simplified)
    const sentences = article.description?.split('.') || [];
    const summary = sentences.slice(0, 2).join('.') + (sentences.length > 2 ? '.' : '');

    // Extract key points
    const keyPoints = [
      article.title,
      sentences[0] || 'No additional details available',
      `Published by ${article.source.name}`,
    ].filter(Boolean);

    return {
      summary,
      sentiment,
      keyPoints,
      readingTime,
    };
  }
}

export const newsApiService = new NewsApiService();