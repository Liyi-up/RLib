import React from 'react';

/**
 * 检查给定的React节点是否为Fragment
 */
export default function isFragment(
  object: React.ReactNode,
): object is React.ReactFragment {
  return React.isValidElement(object) && object.type === React.Fragment;
}
