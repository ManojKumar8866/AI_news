// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { 
//   Newspaper, 
//   Sparkles, 
//   RefreshCw, 
//   Menu,
//   X 
// } from 'lucide-react';
// import { SearchBar } from './SearchBar';
// import { CategoryFilter } from './CategoryFilter';

// interface HeaderProps {
//   onSearch: (query: string) => void;
//   onCategoryChange: (category: string) => void;
//   onRefresh: () => void;
//   selectedCategory?: string;
//   isLoading?: boolean;
// }

// export const Header = ({ 
//   onSearch, 
//   onCategoryChange, 
//   onRefresh, 
//   selectedCategory,
//   isLoading = false 
// }: HeaderProps) => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
//       <div className="container mx-auto px-4 py-4">
//         {/* Top row - Logo and main controls */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center space-x-3">
//             <div className="flex items-center space-x-2">
//               <Newspaper className="w-8 h-8 text-blue-600" />
//               <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                 AI News Hub
//               </h1>
//             </div>
//             <Badge variant="secondary" className="hidden sm:flex items-center space-x-1">
//               <Sparkles className="w-3 h-3" />
//               <span>AI Powered</span>
//             </Badge>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={onRefresh}
//               disabled={isLoading}
//               className="hidden sm:flex items-center space-x-2"
//             >
//               <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
//               <span>Refresh</span>
//             </Button>

//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="sm:hidden"
//             >
//               {isMobileMenuOpen ? (
//                 <X className="w-5 h-5" />
//               ) : (
//                 <Menu className="w-5 h-5" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Search bar - always visible */}
//         <div className="mb-4">
//           <SearchBar 
//             onSearch={onSearch}
//             onClear={() => onCategoryChange('general')}
//             placeholder="Search AI-powered news..."
//           />
//         </div>

//         {/* Category filters - responsive */}
//         <div className={`${isMobileMenuOpen ? 'block' : 'hidden sm:block'}`}>
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//             <CategoryFilter 
//               selectedCategory={selectedCategory}
//               onCategoryChange={onCategoryChange}
//             />
            
//             <div className="flex items-center space-x-2 sm:hidden">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={onRefresh}
//                 disabled={isLoading}
//                 className="flex items-center space-x-2"
//               >
//                 <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
//                 <span>Refresh</span>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Newspaper, 
  Sparkles, 
  RefreshCw, 
  Menu,
  X 
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import UserMenu from './UserMenu'; // 👈 Import the UserMenu

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onRefresh: () => void;
  selectedCategory?: string;
  isLoading?: boolean;
}

export const Header = ({ 
  onSearch, 
  onCategoryChange, 
  onRefresh, 
  selectedCategory,
  isLoading = false 
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        {/* Top row - Logo and main controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Newspaper className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI News Hub
              </h1>
            </div>
            <Badge variant="secondary" className="hidden sm:flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>AI Powered</span>
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="hidden sm:flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>

            {/* 👇 Added User Dropdown menu */}
            <UserMenu />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Search bar - always visible */}
        <div className="mb-4">
          <SearchBar 
            onSearch={onSearch}
            onClear={() => onCategoryChange('general')}
            placeholder="Search AI-powered news..."
          />
        </div>

        {/* Category filters - responsive */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden sm:block'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
            />
            
            <div className="flex items-center space-x-2 sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
