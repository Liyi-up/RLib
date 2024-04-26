import { PropsWithChildren, ReactNode } from 'react';
import CascadeScroll from './CascadeScroll';
import Item from './Item';
import LeftPanel from './LeftPanel';

export type CascadeScrollProps = {
  width?: string | number;
  height?: string | number;
  ContainerClassName?: string;
  children?: (ctx: { activeKey?: string }) => ReactNode;
  defaultActiveKey?: string;
};

export type CascadeScrollStaticProps = {
  Wrapper: typeof CascadeScroll;
  Item: typeof Item;
  LeftPanel: typeof LeftPanel;
};

export type CascadeScrollLeftPanel = PropsWithChildren<{}>;
