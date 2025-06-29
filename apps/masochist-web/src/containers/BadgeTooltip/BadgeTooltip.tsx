import { Badge, Game } from '@masochistme/sdk/dist/v1/types';
import { Flex, Tooltip } from 'components';
import { t } from 'i18n';
import React from 'react';
import { useCuratedGames } from 'sdk';
import styled from 'styled-components';

type Props = {
  badge?: Badge;
  children: React.ReactElement;
};

export const BadgeTooltip = (props: Props) => {
  const { badge, children } = props;

  const { gamesData } = useCuratedGames();
  const game = gamesData.find((g: Game) => g.id === badge?.gameId);
  const gameTitle = (
    game?.title ??
    badge?.title ??
    t('warning.unknown_game').toUpperCase()
  ).toUpperCase();

  return (
    <Tooltip
      content={
        badge ? (
          <StyledTooltip column>
            <div style={{ gap: 'var(--size-4)' }}>
              <span style={{ fontWeight: 'bold' }}>{gameTitle}</span>
              <span> - </span>
              <span>
                {badge.name} ({badge.points} {t('pts')})
              </span>
            </div>
            <div style={{ maxWidth: '25rem', fontStyle: 'italic' }}>
              {badge.description}
            </div>
          </StyledTooltip>
        ) : null
      }>
      {children}
    </Tooltip>
  );
};

const StyledTooltip = styled(Flex)`
  text-align: left;
`;
