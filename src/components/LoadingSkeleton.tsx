import React from 'react';

interface LoadingSkeletonProps {
  height: string;
  width: string;
  borderRadius?: string;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ height, width, borderRadius = 'rounded', className }) => {
  return (
    <div
      className={`animate-pulse ${borderRadius} bg-gray-200 dark:bg-zinc-700 ${className || ''}`}
      style={{ height, width }}
    />
  );
};

export default LoadingSkeleton;
