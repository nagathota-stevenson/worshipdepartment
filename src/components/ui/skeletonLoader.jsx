import React from 'react';

const SkeletonLoader = ({ width, height }) => {
  return (
    <div
      style={{
        backgroundColor: "#e0e0e0",
        height: height,
        width: width,
        borderRadius: "4px",
      }}
    />
  );
};

export default SkeletonLoader;
