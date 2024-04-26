import { CascadeScroll } from '@codeli/react-lib';
import React from 'react';

const { LeftPanel, Item } = CascadeScroll;
export default () => {
  return (
    <CascadeScroll height={'100vh'}>
      {(ctx) => {
        return (
          <LeftPanel>
            <Item></Item>
          </LeftPanel>
        );
      }}
    </CascadeScroll>
  );
};
