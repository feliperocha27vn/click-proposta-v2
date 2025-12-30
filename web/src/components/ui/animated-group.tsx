'use client';
import React, { type ReactNode } from 'react';

export type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  variants?: unknown; // kept for compatibility, ignored
  preset?: unknown;
  as?: React.ElementType;
};

function AnimatedGroup({ children, className, as = 'div' }: AnimatedGroupProps) {
  // Render children directly without motion wrappers
  return React.createElement(
    as,
    { className },
    React.Children.map(children, (child) => child)
  );
}

export { AnimatedGroup };

