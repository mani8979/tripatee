import React from 'react';

// Single Tour Card Shimmer Skeleton
export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      {/* Image box placeholder */}
      <div className="h-64 bg-gray-200 w-full"></div>
      
      {/* Content details placeholder */}
      <div className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded-full w-24"></div>
          <div className="h-4 bg-gray-200 rounded-full w-16"></div>
        </div>
        
        <div className="h-6 bg-gray-200 rounded-full w-4/5 mt-1"></div>
        <div className="h-4 bg-gray-200 rounded-full w-full mt-1"></div>
        <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
        
        <div className="h-px bg-gray-100 w-full my-2"></div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="h-3 bg-gray-200 rounded-full w-12"></div>
            <div className="h-5 bg-gray-200 rounded-full w-16"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-full w-28"></div>
        </div>
      </div>
    </div>
  );
};

// Grid container of card skeletons
export const GridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
};

// Detail Page Shimmer Skeleton
export const DetailSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-10">
      <div className="h-96 md:h-[480px] bg-gray-200 rounded-3xl w-full"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="h-10 bg-gray-200 rounded-full w-2/3"></div>
          <div className="flex gap-4">
            <div className="h-5 bg-gray-200 rounded-full w-24"></div>
            <div className="h-5 bg-gray-200 rounded-full w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded-full w-full mt-4"></div>
          <div className="h-4 bg-gray-200 rounded-full w-full"></div>
          <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
        </div>
        <div className="h-80 bg-gray-200 rounded-3xl w-full"></div>
      </div>
    </div>
  );
};
