'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function BentoSkeleton() {
  return (
    <div className="grid w-full max-w-6xl mx-auto gap-4 md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3">
      <div className="row-span-2 rounded-xl p-4 bg-zinc-900/50 backdrop-blur-xl border border-white/10">
        <Skeleton className="h-4 w-1/3 mb-4" />
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="row-span-1 rounded-xl p-4 bg-zinc-900/50 backdrop-blur-xl border border-white/10">
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="row-span-1 rounded-xl p-4 bg-zinc-900/50 backdrop-blur-xl border border-white/10">
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="row-span-1 rounded-xl p-4 bg-zinc-900/50 backdrop-blur-xl border border-white/10">
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}