import classNames from 'classnames';
import React, { FC } from 'react';
import { DISPLAYNAME_MAP } from './constant';
import { CascadeScrollItem } from './types';

const Item: FC<CascadeScrollItem> = (props) => {
  const {
    children,
    onClick,
    style,
    className,
    width,
    height,
    label,
    activeKey,
    value,
    highlightCondition = false,
  } = props;

  return (
    <div
      data-id={value}
      id={value}
      onClick={onClick}
      style={{ ...style, width, height }}
      className={classNames(className, { 'text-cyan-600': highlightCondition })}
    >
      {label ? label : children}
    </div>
  );
};
Item.displayName = DISPLAYNAME_MAP.CASCADE_SCROLL_ITEM;
export default Item;
