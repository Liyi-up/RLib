import classNames from 'classnames';
import React, { Children, FC, isValidElement, useRef, useState } from 'react';
import extractChildrenFromFragment from '../../helper/extractChildrenFromFragment';
import isFragment from '../../helper/isFragment';
import Item from './Item';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { DISPLAYNAME_MAP } from './constant';
import {
  CascadeScrollProps,
  CascadeScrollStaticProps,
  ChildrenRenderContext,
} from './types';

const CascadeScroll: FC<CascadeScrollProps> & CascadeScrollStaticProps = (
  props,
) => {
  const {
    width = '100%',
    height = '100%',
    children,
    className,
    defaultActiveKey,
  } = props;
  const [activeKey, setActiveKey] = useState(defaultActiveKey);
  const [isRightScroll, setRightScroll] = useState(false);
  const isMenuClick = useRef(false);

  const context: ChildrenRenderContext = {
    activeKey,
    setActiveKey,
    setRightScroll,
    isMenuClick,
    isRightScroll,
  };

  const render = () => {
    if (!children || typeof children !== 'function') {
      return null;
    }
    let canRender = true;
    let childrens = children(context) as unknown as React.ReactNode;
    if (isFragment(childrens)) {
      childrens = extractChildrenFromFragment(childrens);
    }

    Children.forEach(childrens, (child) => {
      if (!isValidElement(child)) {
        canRender = false;
        return;
      }

      if (
        (child.type as any).displayName !==
          DISPLAYNAME_MAP.CASCADE_SCROLL_LEFT_PANEL &&
        (child.type as any).displayName !==
          DISPLAYNAME_MAP.CASCADE_SCROLL_RIGHT_PANEL
      ) {
        canRender = false;
        return;
      }
    });
    return canRender ? (
      childrens
    ) : (
      <span style={{ color: 'red' }}>
        Passing a CascadeScroll must be a CascadeScrollLeftPanel
      </span>
    );
  };

  return (
    <div className={classNames(className, 'flex')} style={{ width, height }}>
      {render()}
    </div>
  );
};

CascadeScroll.Wrapper = CascadeScroll;
CascadeScroll.Item = Item;
CascadeScroll.LeftPanel = LeftPanel;
CascadeScroll.RightPanel = RightPanel;
CascadeScroll.displayName = DISPLAYNAME_MAP.CASCADE_SCROLL;

export default CascadeScroll;
