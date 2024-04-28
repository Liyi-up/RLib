import { CascadeScroll } from '@codeli/react-lib';
import React from 'react';
import './CascadeScroll.less';

const { LeftPanel, Item, RightPanel } = CascadeScroll;

function getRandomHexColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default () => {
  const data = Array.from({ length: 6 }, (_, index) => {
    return {
      value: `item${index}`,
      label: `item${index}`,
      backgroundColor: getRandomHexColor(),
    };
  });

  return (
    <CascadeScroll
      className={'customContainer'}
      defaultActiveKey={data[0].value}
      height={500}
    >
      {(context) => {
        return (
          <>
            <LeftPanel {...context} width="10vw">
              {data.map((item) => (
                <Item
                  value={item.value}
                  className="leftItem"
                  key={item.value}
                  highlightCondition={context.activeKey === item.value}
                >
                  {item.value}
                </Item>
              ))}
            </LeftPanel>
            <RightPanel {...context} width="90vw">
              {data.map((item) => (
                <Item
                  value={item.value}
                  className="rightItem"
                  key={item.value}
                  style={{ backgroundColor: item.backgroundColor }}
                >
                  {item.value}
                </Item>
              ))}
            </RightPanel>
          </>
        );
      }}
    </CascadeScroll>
  );
};
