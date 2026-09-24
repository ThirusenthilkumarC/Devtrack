import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`bg-zinc-800/60 animate-pulse rounded-md ${className}`} />
  );
};

export default Skeleton;
