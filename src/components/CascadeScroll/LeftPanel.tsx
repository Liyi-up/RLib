import React, { FC } from 'react';
import { DISPLAYNAME_MAP } from './constant';
import { CascadeScrollLeftPanel } from './types';

const LeftPanel: FC<CascadeScrollLeftPanel> = (props) => {
  return <div>CascadeScrollLeftPanel</div>;
};
LeftPanel.displayName = DISPLAYNAME_MAP.CASCADE_SCROLL_LEFT_PANEL;
export default LeftPanel;
