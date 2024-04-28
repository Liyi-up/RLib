import React from 'react';
import isFragment from './isFragment';

export default function extractChildrenFromFragment(
  children: React.ReactNode,
): React.ReactNode[] {
  if (isFragment(children)) {
    return React.Children.toArray(
      (children as unknown as { props: { children: React.ReactNode } }).props
        .children,
    );
  }

  return React.Children.toArray(children);
}
