import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, ExternalLink, User, Sparkles, ChevronDown, ChevronUp, Clock, BarChart3 } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { newsApiService } from '@/services/newsApi';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const handleShowSummary = () => {
    if (!showSummary && !summary) {
      const aiAnalysis = newsApiService.generateAIAnalysis(article);
      setSummary(aiAnalysis);
    }
    setShowSummary(!showSummary);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Date not available';
    }
  };

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  return (
    <Card className="h-full flex flex-col group hover:shadow-lg transition-all duration-200 border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight line-clamp-3 group-hover:text-primary transition-colors">
            {article.title}
          </CardTitle>
          {article.category && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              {article.category}
            </Badge>
          )}
        </div>
        
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {article.description}
        </CardDescription>
      </CardHeader>

      {article.urlToImage && (
        <div className="px-6 pb-3">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-48 object-cover rounded-md bg-muted"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';
            }}
          />
        </div>
      )}

      <CardContent className="flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{article.author}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Source: {article.source.name}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowSummary}
              className="h-8 px-3 text-xs"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              AI Summary
              {showSummary ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          </div>

          {showSummary && summary && (
            <div className="space-y-3 mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">AI Analysis</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Summary</h4>
                  <p className="text-sm leading-relaxed">{summary.summary}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      Sentiment
                    </h4>
                    <Badge className={`text-xs ${getSentimentColor(summary.sentiment)}`}>
                      {summary.sentiment.charAt(0).toUpperCase() + summary.sentiment.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Reading Time
                    </h4>
                    <span className="text-sm">{summary.readingTime} min</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Key Points</h4>
                  <ul className="space-y-1">
                    {summary.keyPoints.map((point: string, index: number) => (
                      <li key={index} className="text-xs flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Read Full Article
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}