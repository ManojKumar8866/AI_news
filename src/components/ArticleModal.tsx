import { NewsArticle } from '@/types/news';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CalendarDays, 
  Clock, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  User,
  Lightbulb
} from 'lucide-react';
import { format } from 'date-fns';

interface ArticleModalProps {
  article: NewsArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ArticleModal = ({ article, open, onOpenChange }: ArticleModalProps) => {
  if (!article) return null;

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentText = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'Positive';
      case 'negative':
        return 'Negative';
      default:
        return 'Neutral';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="w-fit">
              {article.category}
            </Badge>
            <div className="flex items-center space-x-2">
              {getSentimentIcon(article.sentiment)}
              <span className="text-sm text-muted-foreground">
                {getSentimentText(article.sentiment)}
              </span>
            </div>
          </div>
          
          <DialogTitle className="text-2xl leading-tight mb-4">
            {article.title}
          </DialogTitle>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${article.source.name}`} />
                  <AvatarFallback className="text-xs">
                    {article.source.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{article.source.name}</span>
              </div>
              
              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <CalendarDays className="w-4 h-4" />
                <span>{format(new Date(article.publishedAt), 'MMM dd, yyyy HH:mm')}</span>
              </div>
              {article.readingTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readingTime} min read</span>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {article.urlToImage && (
          <div className="mb-6">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <DialogDescription className="text-base mb-6">
          {article.description}
        </DialogDescription>

        {article.aiSummary && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">AI Summary</h3>
            </div>
            <p className="text-blue-800 mb-3">{article.aiSummary}</p>
            
            {article.keyPoints && article.keyPoints.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Key Points:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                  {article.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {article.content && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Full Article</h3>
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {article.content}
              </p>
            </div>
          </div>
        )}

        <Separator className="my-6" />

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <p>Source: {article.source.name}</p>
            {article.author && <p>Author: {article.author}</p>}
          </div>
          
          <Button asChild>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Read Original Article</span>
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};