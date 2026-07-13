import { useState } from 'react';
import { NewsArticle } from '@/types/news';
import { useNews } from '@/hooks/useNews';
import { Header } from '@/components/Header';
import { NewsGrid } from '@/components/NewsGrid';
import { ArticleModal } from '@/components/ArticleModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/LoadingState';
import { toast } from 'sonner';

export default function Index() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    articles,
    loading,
    error,
    hasMore,
    searchNews,
    filterByCategory,
    loadMore,
    refresh,
  } = useNews();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchNews(query);
    toast.success('Searching news...', {
      description: `Looking for articles about "${query}"`,
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    filterByCategory(category);
    toast.info('Category updated', {
      description: `Showing ${category} news`,
    });
  };

  const handleReadMore = (article: NewsArticle) => {
    setSelectedArticle(article);
    
    // Track article views in localStorage
    const viewedArticles = JSON.parse(localStorage.getItem('viewedArticles') || '[]');
    const updatedViewed = [...viewedArticles, article.id].slice(-50); // Keep last 50
    localStorage.setItem('viewedArticles', JSON.stringify(updatedViewed));
  };

  const handleRefresh = () => {
    refresh();
    toast.success('Refreshing news feed...', {
      description: 'Getting the latest articles with AI analysis',
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onRefresh={handleRefresh}
          selectedCategory={selectedCategory}
          isLoading={loading}
        />

        <main className="container mx-auto px-4 py-8">
          {/* Status bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {searchQuery ? (
                  <>Search results for "{searchQuery}"</>
                ) : (
                  <>Latest {selectedCategory === 'general' ? '' : selectedCategory} News</>
                )}
              </h2>
              {articles.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {articles.length} articles found
                </span>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                API Error - Showing cached content
              </div>
            )}
          </div>

          {/* Loading state for initial load */}
          {loading && articles.length === 0 ? (
            <LoadingState />
          ) : (
            <NewsGrid
              articles={articles}
              loading={loading}
              error={error}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onReadMore={handleReadMore}
            />
          )}
        </main>

        {/* Article detail modal */}
        <ArticleModal
          article={selectedArticle}
          open={!!selectedArticle}
          onOpenChange={(open) => !open && setSelectedArticle(null)}
        />

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-muted-foreground">
              <p className="mb-2">
                <strong>AI News Hub</strong> - Your intelligent news companion
              </p>
              <p className="text-sm">
                Powered by AI analysis for better news understanding • Built with React & Shadcn/ui
              </p>
              <div className="flex justify-center items-center mt-4 space-x-4 text-xs">
                <span>🤖 AI Summaries</span>
                <span>📊 Sentiment Analysis</span>
                <span>⚡ Real-time Updates</span>
                <span>🔍 Smart Search</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}