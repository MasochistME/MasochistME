import { Badge } from '@masochistme/sdk/dist/v1/types';
import { Flex } from 'components';
import { BadgeThumbnail, BadgeTile, Section } from 'containers';
import { t } from 'i18n';
import { useGameBadges } from 'sdk';
import styled from 'styled-components';

type Props = {
  gameId: number;
  isCompact?: boolean;
};

export const ModalLeaderboardsBadges = (props: Props): JSX.Element | null => {
  const { gameId, isCompact = false } = props;

  const { gameBadgesData: badges, isFetched: isBadgeListLoaded } =
    useGameBadges(gameId);

  if (!isBadgeListLoaded || !badges?.length) return null;

  return (
    <Section
      fullWidth
      boxSizing="border-box"
      title={t('badges')}
      content={
        <StyledModalLeaderboardsBadges justify>
          {badges.map((badge: Badge) => {
            if (!isCompact)
              return <BadgeTile badge={badge} key={`badge-${badge._id}`} />;
            return (
              <BadgeThumbnail
                badge={badge}
                key={`badge-${String(badge._id)}`}
              />
            );
          })}
        </StyledModalLeaderboardsBadges>
      }
    />
  );
};

const StyledModalLeaderboardsBadges = styled(Flex)`
  gap: var(--size-8);
  width: 100%;
  flex-flow: row wrap;
`;
