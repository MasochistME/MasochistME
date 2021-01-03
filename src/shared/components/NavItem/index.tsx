import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeTab } from '../../store/modules/Tabs';

type TNavItem = {
  item: any;
};

export default function NavItem(props: TNavItem): JSX.Element {
  const { item } = props;
  const dispatch = useDispatch();
  const activeTab = useSelector((state: any) => state.activeTab);

  const onTabOpen = () =>
    item.external ? window.open(item.link) : dispatch(changeTab(item.link));

  return (
    <li
      onClick={onTabOpen}
      className={
        item.link === activeTab ? 'flex-column tab-active' : 'flex-column'
      }>
      <div className="flex-column">
        <i className={item.icon} />
        <p>{item.text}</p>
      </div>
    </li>
  );
}
