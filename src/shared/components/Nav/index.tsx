import React from 'react';
import { useSelector } from 'react-redux';
import NavItem from '../NavItem';

export default function Nav(): JSX.Element {
  const tabs = useSelector((state: any) => state.tabs);

  return (
    <ul className="flex-row">
      {tabs.map((item: any, index: number) =>
        item.visible ? (
          <NavItem key={`nav-${index} `} item={item} index={index} />
        ) : null,
      )}
    </ul>
  );
}
