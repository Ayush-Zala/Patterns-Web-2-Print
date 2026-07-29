import { Skeleton } from '@patterns/ui';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <Skeleton className="mb-4 h-12 w-12 rounded-full" />
      <Skeleton className="mb-2 h-4 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
