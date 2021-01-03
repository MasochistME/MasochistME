import React from 'react';
import { useSelector } from 'react-redux';

export default function MiniHeader(): JSX.Element {
  // const title = 'Game List';
  // const icon = 'fas fa-gamepad';

  const tabs = useSelector((state: any) => state.tabs);
  const activeTab = useSelector((state: any) => state.activeTab);

  const findTab = () => tabs.find((tab: any) => tab.link === activeTab);

  return (
    <div className="wrapper-miniheader flex-row">
      <div className="flex-row">
        <i className={findTab().icon} />
        <p>{findTab().text}</p>
      </div>
    </div>
  );
}
