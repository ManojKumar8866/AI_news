import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Laptop, 
  Trophy, 
  Building2, 
  Landmark, 
  Heart, 
  Sparkles, 
  Globe,
  TrendingUp 
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const categories: Category[] = [
  { id: 'general', name: 'General', icon: <Globe className="w-4 h-4" />, color: 'bg-gray-500' },
  { id: 'technology', name: 'Technology', icon: <Laptop className="w-4 h-4" />, color: 'bg-blue-500' },
  { id: 'business', name: 'Business', icon: <Building2 className="w-4 h-4" />, color: 'bg-green-500' },
  { id: 'sports', name: 'Sports', icon: <Trophy className="w-4 h-4" />, color: 'bg-orange-500' },
  { id: 'politics', name: 'Politics', icon: <Landmark className="w-4 h-4" />, color: 'bg-red-500' },
  { id: 'health', name: 'Health', icon: <Heart className="w-4 h-4" />, color: 'bg-pink-500' },
  { id: 'entertainment', name: 'Entertainment', icon: <Sparkles className="w-4 h-4" />, color: 'bg-purple-500' },
  { id: 'science', name: 'Science', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-indigo-500' },
];

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="flex items-center space-x-2"
        >
          {category.icon}
          <span>{category.name}</span>
          {selectedCategory === category.id && (
            <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
              Active
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};