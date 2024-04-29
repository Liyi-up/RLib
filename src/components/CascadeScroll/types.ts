import { CSSProperties, Dispatch, ReactNode } from 'react';
import CascadeScroll from './CascadeScroll';
import Item from './Item';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

interface BaseProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
}

export interface ChildrenRenderContext {
  activeKey?: string;
  setActiveKey: Dispatch<string>;
  setRightScroll: Dispatch<boolean>;
  isMenuClick: React.MutableRefObject<boolean>;
  isRightScroll: boolean;
}

export interface BasePanelProps extends ChildrenRenderContext {
  children?: ReactNode | undefined;
}

export interface CascadeScrollProps extends BaseProps {
  children?: (ctx: ChildrenRenderContext) => ReactNode;
  defaultActiveKey?: string;
}

export interface CascadeScrollStaticProps {
  Wrapper: typeof CascadeScroll;
  Item: typeof Item;
  LeftPanel: typeof LeftPanel;
  RightPanel: typeof RightPanel;
}

export interface CascadeScrollLeftPanel extends BaseProps, BasePanelProps {}

export interface CascadeScrollRightPanel extends BaseProps, BasePanelProps {
  isRightScroll: boolean;
  easingType: EasingFunctionEnum;
}

export interface CascadeScrollItem extends BaseProps {
  value: string;
  label?: string;
  children?: ReactNode | undefined;
  onClick?: () => void;
  highlightCondition?: boolean;
  highlightColor?: string;
}

export type EasingFunction = (t: number) => number;

export enum EasingFunctionEnum {
  easeInQuad = 'easeInQuad',
  easeOutQuad = 'easeOutQuad',
  easeInOutQuad = 'easeInOutQuad',
  easeInOutCubic = 'easeInOutCubic',
  easeOutExpo = 'easeOutExpo',
}
