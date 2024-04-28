import classNames from 'classnames';
import React, {
  Children,
  FC,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
} from 'react';
import { DISPLAYNAME_MAP } from './constant';
import smoothScrollTo from './helper/smoothScrollTo';
import { CascadeScrollItem, CascadeScrollRightPanel } from './types';

const RightPanel: FC<CascadeScrollRightPanel> = (props) => {
  const {
    activeKey,
    style,
    className,
    width,
    height,
    children,
    isRightScroll,
    isMenuClick,
    setActiveKey,
    setRightScroll,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);

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
          },
        });
      },
    );
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!activeKey || !container) {
      return;
    }

    if (!isRightScroll) {
      const target = container.querySelector(
        `[data-id="${activeKey}"]`,
      ) as HTMLDivElement;

      if (target) {
        smoothScrollTo(container, target).then((isScroll) => {
          if (isScroll) {
            isMenuClick.current = false;
          }
        });
      }
    }
  }, [isRightScroll, activeKey]);

  const checkSelectKeyShouldChangeWithScroll = (
    isLastItem: boolean,
    culTop: number,
    realTop: number,
    nextItemTop: number,
  ) => {
    return (
      (isLastItem && culTop <= realTop) ||
      (!isLastItem && culTop <= realTop && realTop <= nextItemTop)
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuClick.current || !containerRef.current) return;
      const container = containerRef.current;
      const realTop = container.getBoundingClientRect().top + 22;
      const items = Array.from(container.children) as HTMLDListElement[];
      items.forEach((child, index) => {
        const culTop = child.getBoundingClientRect().top;
        const isLastItem = index === items.length - 1;
        const nextItemTop = items[index + 1]?.getBoundingClientRect()?.top;
        const isSelectKeyShouldChangeWithScroll =
          checkSelectKeyShouldChangeWithScroll(
            isLastItem,
            culTop,
            realTop,
            nextItemTop,
          );
        const key = child['dataset'].id as string;
        console.log('realTop', culTop, realTop, key);
        if (isSelectKeyShouldChangeWithScroll) {
          if (key) {
            if (activeKey !== key) {
              setRightScroll(true);
              setActiveKey(key);
            }
          }
        }
      });
    };
    containerRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [setActiveKey, setRightScroll, activeKey, isMenuClick]);

  return (
    <div
      ref={containerRef}
      className={classNames(className, 'h-full overflow-auto')}
      style={{ ...style, width, height }}
    >
      {render()}
    </div>
  );
};
RightPanel.displayName = DISPLAYNAME_MAP.CASCADE_SCROLL_RIGHT_PANEL;
export default RightPanel;
