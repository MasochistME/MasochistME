import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Wrapper, Flex, BigBadge, Table } from 'shared/components';
import { stringCompare, booleanCompare } from 'shared/helpers';
import BadgeEditSection from './BadgeEditSection';

export default function PageManageBadges(): JSX.Element {
  const games = useSelector((state: any) => state.games);
  const badges = useSelector((state: any) => state.badges);
  const [selectedBadge, setSelectedBadge] = useState();

  const getGameTitle = (badge: any): string => {
    if (badge.game) {
      return badge.game;
    }
    const gameId = badge.gameId;
    const game = games?.list?.find((g: any) => Number(g.id) === Number(gameId));
    return game?.title ?? 'UNKNOWN';
  };

  const columns: any[] = [
    {
      dataIndex: 'img',
      key: 'img',
      render: (item: string) => (
        <BigBadge
          src={item}
          style={{
            width: '48px',
            height: '48px',
            minWidth: '48px',
            minHeight: '48px',
            margin: '4px',
          }}
        />
      ),
    },
    {
      title: 'Pts',
      dataIndex: 'points',
      key: 'points',
      sorter: (a: any, b: any) => (a?.points ?? 0) - (b?.points ?? 0),
    },
    {
      title: 'Game',
      dataIndex: '',
      key: 'game',
      render: (badge: any) => getGameTitle(badge),
      sorter: (a: any, b: any) =>
        stringCompare(getGameTitle(a), getGameTitle(b)),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => stringCompare(a?.name, b?.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a: any, b: any) => stringCompare(a?.description, b?.description),
    },
    {
      title: 'Requirements',
      dataIndex: 'requirements',
      key: 'requirements',
      sorter: (a: any, b: any) =>
        stringCompare(a?.requirements, b?.requirements),
    },

    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (item: boolean) => (item ? 'yes' : 'no'),
      sorter: (a: any, b: any) => booleanCompare(a?.enabled, b?.enabled),
    },
    {
      title: 'Legacy',
      dataIndex: 'legacy',
      key: 'legacy',
      render: (item: boolean) => (item ? 'yes' : 'no'),
      sorter: (a: any, b: any) => booleanCompare(a?.legacy, b?.legacy),
    },
  ];

  const onBadgeSelect = (badge: any) => {
    setSelectedBadge(badge);
  };

  return (
    <Flex column>
      <Wrapper type="description">
        <h2>Manage badges</h2>
      </Wrapper>
      <Wrapper type="page">
        <Table
          clickable
          columns={columns}
          dataSource={badges}
          pagination={{ pageSize: 5 }}
          onRow={(badge: any) => {
            return {
              onClick: () => onBadgeSelect(badge),
            };
          }}
        />
        <BadgeEditSection selectedBadge={selectedBadge} />
      </Wrapper>
    </Flex>
  );
}
