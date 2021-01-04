import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeTab } from '../../store/modules/Tabs';

export default function Nav(): JSX.Element {
  const tabs = useSelector((state: any) => state.tabs);

  return (
    <ul className="flex-row">
      {tabs.map((item: any, index: number) =>
        item.visible ? <NavItem key={`nav-${index} `} item={item} /> : null,
      )}
    </ul>
  );
}

type Props = {
  item: any;
};

function NavItem(props: Props): JSX.Element {
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
