import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const LoadingState = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-full">
          <div className="relative overflow-hidden rounded-t-lg">
            <Skeleton className="w-full h-48" />
          </div>
          
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="w-20 h-4" />
              </div>
              <Skeleton className="w-4 h-4" />
            </div>
            
            <Skeleton className="w-full h-6 mb-2" />
            <Skeleton className="w-full h-4 mb-1" />
            <Skeleton className="w-3/4 h-4 mb-3" />
            
            <div className="border-l-4 border-gray-200 pl-3 py-2 mb-3">
              <Skeleton className="w-20 h-4 mb-1" />
              <Skeleton className="w-full h-4" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-12 h-4" />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Skeleton className="flex-1 h-8" />
              <Skeleton className="w-16 h-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};