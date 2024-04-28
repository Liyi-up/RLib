import classNames from 'classnames';
import React, { Children, FC, cloneElement, isValidElement } from 'react';
import { DISPLAYNAME_MAP } from './constant';
import { CascadeScrollItem, CascadeScrollLeftPanel } from './types';

const LeftPanel: FC<CascadeScrollLeftPanel> = (props) => {
  const {
    activeKey,
    style,
    className,
    width,
    height,
    children,
    setActiveKey,
    setRightScroll,
    isMenuClick,
  } = props;

  const render = () => {
    if (!children) {
      return null;
    }

    return Children.map(
      children as unknown as { props: CascadeScrollItem },
      (child) => {
        if (!isValidElement(child)) {
          return;
        }

        if (
          (child.type as any).displayName !==
          DISPLAYNAME_MAP.CASCADE_SCROLL_ITEM
        ) {
          return;
        }
        return cloneElement(child, {
          ...child.props,
          activeKey,
          onClick: () => {
            child.props.onClick?.();
            choice(child.props.value);
          },
        });
      },
    );
  };

  const choice = (nextKey: string) => {
    setRightScroll(false);
    setActiveKey(nextKey);
    isMenuClick.current = true;
  };

  return (
    <div
      className={classNames(className, 'flex flex-col h-full')}
      style={{ ...style, width, height }}
    >
      {render()}
    </div>
  );
};
LeftPanel.displayName = DISPLAYNAME_MAP.CASCADE_SCROLL_LEFT_PANEL;
export default LeftPanel;
