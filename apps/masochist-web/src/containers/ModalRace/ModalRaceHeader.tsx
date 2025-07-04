import { RaceType } from '@masochistme/sdk/dist/v1/types';
import {
  ErrorFallback,
  Flex,
  Icon,
  QueryBoundary,
  Size,
  Skeleton,
  Spinner,
} from 'components';
import { t } from 'i18n';
import { useRaceById } from 'sdk';
import styled from 'styled-components';
import { getRaceTypeIcon } from 'utils';

type Props = {
  raceId?: string | null;
};

export const ModalRaceHeader = (props: Props) => (
  <QueryBoundary
    fallback={<ModalRaceSkeleton />}
    errorFallback={<ErrorFallback />}>
    <HeaderBoundary {...props} />
  </QueryBoundary>
);

const HeaderBoundary = (props: Props) => {
  const { raceId } = props;
  const { raceData: race } = useRaceById(raceId);
  if (!race) return <Spinner />;

  const icon = getRaceTypeIcon(race);
  const iconTextHover =
    race.type === RaceType.SCORE_BASED
      ? t('race.header.race_type.score')
      : t('race.header.race_type.score');

  return (
    <StyledModalRaceHeader column>
      <Flex align gap={8}>
        <Icon icon={icon} hoverText={iconTextHover} size={Size.SMALL} />
        <h2>
          <a href={race.downloadLink} target="_blank">
            {race.name.toUpperCase()}
          </a>
        </h2>
      </Flex>
      <p>
        <span style={{ fontWeight: 600 }}>
          {t('race.header.instructions')}:
        </span>{' '}
        {race.instructions}
      </p>
      <p>
        <span style={{ fontWeight: 600 }}>{t('race.header.objectives')}:</span>{' '}
        {race.objectives}
      </p>
      <Flex align width="100%" justifyContent="space-around">
        <Flex column align>
          <span style={{ fontWeight: 600 }}>
            {t('race.header.download_grace_time')}:
          </span>
          {race.downloadGrace}s
        </Flex>
        <Flex column align>
          <span style={{ fontWeight: 600 }}>
            {t('race.header.proof_grace_time')}:
          </span>
          {race.uploadGrace}s
        </Flex>
      </Flex>
    </StyledModalRaceHeader>
  );
};

const ModalRaceSkeleton = () => (
  <StyledModalRaceHeader column>
    <Flex align gap={8}>
      <Skeleton />
      <Skeleton width="100%" />
    </Flex>
    <Skeleton width="100%" height="20rem" />
  </StyledModalRaceHeader>
);

const StyledModalRaceHeader = styled(Flex)`
  justify-content: space-between;
  text-align: left;
  gap: var(--size-8);
  padding: var(--size-8);
  p,
  h2 {
    margin: 0;
    padding: 0;
  }
`;
