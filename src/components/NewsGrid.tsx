import { NewsArticle } from '@/types/news';
import { NewsCard } from './NewsCard';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewsGridProps {
  articles: NewsArticle[];
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onReadMore?: (article: NewsArticle) => void;
}

export const NewsGrid = ({ 
  articles, 
  loading = false, 
  error, 
  hasMore = false, 
  onLoadMore,
  onReadMore 
}: NewsGridProps) => {
  if (error && articles.length === 0) {
    return (
      <Alert className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}. Please try again later or check your internet connection.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading && articles.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-muted-foreground">Loading news...</span>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-4">No articles found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search terms or category filter
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard 
            key={article.id} 
            article={article} 
            onReadMore={onReadMore}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-32"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {error && articles.length > 0 && (
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Showing cached content.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};