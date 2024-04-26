import React, { FC } from 'react';
import { DISPLAYNAME_MAP } from './constant';

type Props = React.PropsWithChildren<{
  onClick?: () => void;
}>;

const Item: FC<Props> = (props) => {
  const { children, onClick } = props;
  return <div onClick={onClick}>{children}</div>;
};
Item.displayName = DISPLAYNAME_MAP.CASCADE_SCROLL_ITEM;
export default Item;
