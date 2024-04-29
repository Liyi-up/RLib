import classNames from 'classnames';
import React, { FC } from 'react';
import { ROOT_CLASS_NAME_PREFIX } from '../../constant';
import { COMPONENT_CLASS_PREFIX, DISPLAYNAME_MAP } from './constant';
import { CascadeScrollItem } from './types';

const classPrefix = `${ROOT_CLASS_NAME_PREFIX}-${COMPONENT_CLASS_PREFIX}`;

const Item: FC<CascadeScrollItem> = (props) => {
  const {
    children,
    onClick,
    style,
    className,
    width,
    height,
    label,
    value,
    highlightCondition = false,
  } = props;

  return (
    <div
      data-id={value}
      id={value}
      onClick={onClick}
      style={{ ...style, width, height }}
      className={classNames(className, {
        [`${classPrefix}-selected`]: highlightCondition,
      })}
    >
      {label ? label : children}
    </div>
  );
};
Item.displayName = DISPLAYNAME_MAP.CASCADE_SCROLL_ITEM;
export default Item;
