import React from "react";

export default function Skeleton({ className = "", style = {} }) {
  return (
    <div
      className={`animate-pulse bg-[#232323] rounded ${className}`}
      style={Object.assign({ minHeight: 20 }, style)}
    />
  );
}
