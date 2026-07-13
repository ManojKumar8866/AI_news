import { useState, useEffect } from 'react';
import { NewsArticle, SearchParams } from '@/types/news';
import { newsApiService } from '@/services/newsApi';
import { toast } from 'sonner';

export const useNews = (initialParams: SearchParams = {}) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchNews = async (params: SearchParams = {}, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = reset ? 1 : page;
      const searchParams = { 
        ...initialParams, 
        ...params, 
        page: currentPage,
        pageSize: params.pageSize || 20 
      };

      let response;
      try {
        if (params.q && params.q.trim()) {
          response = await newsApiService.searchNews(searchParams);
        } else if (params.category && params.category !== 'general') {
          response = await newsApiService.getNewsByCategory(params.category);
        } else {
          response = await newsApiService.getTopHeadlines(searchParams);
        }
      } catch (apiError) {
        console.error('API call failed:', apiError);
        // Try to get cached data first
        const cached = localStorage.getItem('cachedNews');
        if (cached && reset) {
          const cachedArticles = JSON.parse(cached);
          setArticles(cachedArticles);
          setError('Using cached data - API unavailable');
          return;
        }
        throw apiError;
      }

      // Validate response
      if (!response || !Array.isArray(response.articles)) {
        throw new Error('Invalid API response format');
      }

      const newArticles = response.articles.map(article => {
        const aiAnalysis = newsApiService.generateAIAnalysis(article);
        return {
          ...article,
          aiSummary: aiAnalysis.summary,
          sentiment: aiAnalysis.sentiment,
          keyPoints: aiAnalysis.keyPoints,
          readingTime: aiAnalysis.readingTime,
        } as NewsArticle;
      });

      if (reset) {
        setArticles(newArticles);
        setPage(2);
      } else {
        // Avoid duplicates when loading more
        setArticles(prev => {
          const existingIds = new Set(prev.map(article => article.id));
          const uniqueNewArticles = newArticles.filter(article => !existingIds.has(article.id));
          return [...prev, ...uniqueNewArticles];
        });
        setPage(prev => prev + 1);
      }

      setHasMore(newArticles.length === (searchParams.pageSize || 20));
      
      // Cache articles in localStorage (keep last 20 for better fallback)
      if (newArticles.length > 0) {
        localStorage.setItem('cachedNews', JSON.stringify(newArticles.slice(0, 20)));
        localStorage.setItem('cacheTimestamp', Date.now().toString());
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news';
      console.error('News fetch error:', err);
      setError(errorMessage);
      
      toast.error('Failed to load news', {
        description: 'Check your connection or try again later',
      });
      
      // Try to load cached data only if we have no current articles
      if (reset && articles.length === 0) {
        const cached = localStorage.getItem('cachedNews');
        const cacheTimestamp = localStorage.getItem('cacheTimestamp');
        
        if (cached) {
          const cacheAge = Date.now() - (parseInt(cacheTimestamp || '0') || 0);
          const maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (cacheAge < maxCacheAge) {
            try {
              const cachedArticles = JSON.parse(cached);
              setArticles(cachedArticles);
              toast.info('Loaded cached articles', {
                description: 'Showing previously fetched news',
              });
            } catch (parseError) {
              console.error('Failed to parse cached data:', parseError);
            }
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const searchNews = (query: string) => {
    fetchNews({ q: query }, true);
  };

  const filterByCategory = (category: string) => {
    fetchNews({ category }, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchNews();
    }
  };

  const refresh = () => {
    fetchNews({}, true);
  };

  useEffect(() => {
    fetchNews({}, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    articles,
    loading,
    error,
    hasMore,
    searchNews,
    filterByCategory,
    loadMore,
    refresh,
  };
};