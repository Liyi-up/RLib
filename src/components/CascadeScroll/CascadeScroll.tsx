import React, { Children, FC, isValidElement, useMemo, useState } from 'react';
import Item from './Item';
import LeftPanel from './LeftPanel';
import { DISPLAYNAME_MAP } from './constant';
import { CascadeScrollProps, CascadeScrollStaticProps } from './types';

const CascadeScroll: FC<CascadeScrollProps> & CascadeScrollStaticProps = (
  props,
) => {
  const {
    width = '100%',
    height = '100%',
    children,
    ContainerClassName,
    defaultActiveKey,
  } = props;
  const [activeKey, setActiveKey] = useState(defaultActiveKey);
  const ctx = {
    activeKey,
  };

  const wrapperChildren = useMemo(() => {
    if (!children || typeof children !== 'function') {
      return null;
    }

    let canRender = true;

    Children.forEach(children(ctx), (child) => {
      if (!isValidElement(child)) {
        canRender = false;
        return;
      }

      if (
        (child.type as any).displayName !==
        DISPLAYNAME_MAP.CASCADE_SCROLL_LEFT_PANEL
      ) {
        canRender = false;
        return;
      }
    });
    return canRender ? (
      children({ activeKey })
    ) : (
      <span style={{ color: 'red' }}>
        Passing a CascadeScroll must be a CascadeScrollLeftPanel
      </span>
    );
  }, [children]);

  return (
    <div className={ContainerClassName} style={{ width, height }}>
      {wrapperChildren}
    </div>
  );
};

CascadeScroll.Wrapper = CascadeScroll;
CascadeScroll.Item = Item;
CascadeScroll.LeftPanel = LeftPanel;
CascadeScroll.displayName = DISPLAYNAME_MAP.CASCADE_SCROLL;

export default CascadeScroll;
