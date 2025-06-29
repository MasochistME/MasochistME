import {
    ErrorFallback,
    Flex,
    Icon,
    Loader,
    QueryBoundary,
    Warning,
} from 'components';
import { Section, SectionProps } from 'containers';
import { useRacesFromSeason } from 'hooks';
import { t } from 'i18n';
import { useState } from 'react';
import styled from 'styled-components';
import { SeasonSelect } from './SeasonSelect';
import { SingleSeason } from './SingleSeason';

export const RacesPage = (): JSX.Element => {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  return (
    <StyledWrapper>
      <Flex row width="100%">
        <Flex column width="100%" gap={16}>
          <SeasonSelect
            selectedSeasonId={selectedSeasonId}
            setSelectedSeasonId={setSelectedSeasonId}
          />
          <QueryBoundary
            fallback={<Loader />}
            errorFallback={<ErrorFallback />}>
            <SeasonBoundary selectedSeasonId={selectedSeasonId} />
          </QueryBoundary>
        </Flex>
        <Flex column gap={16}>
          <RacesInfoBasic isDesktopOnly width="100%" maxWidth="45rem" />
          <RacesInfoPoints isDesktopOnly width="100%" maxWidth="45rem" />
          <RacesInfoJoin isDesktopOnly width="100%" maxWidth="45rem" />
        </Flex>
      </Flex>
      <Flex justify alignItems="flex-start" flexWrap="wrap" gap={16}>
        <RacesInfoBasic isMobileOnly width="30%" minWidth="30rem" />
        <RacesInfoPoints isMobileOnly width="30%" minWidth="30rem" />
        <RacesInfoJoin isMobileOnly width="30%" minWidth="30rem" />
      </Flex>
    </StyledWrapper>
  );
};

type Props = {
  selectedSeasonId: string | null;
};
const SeasonBoundary = ({ selectedSeasonId }: Props) => {
  const { season, races } = useRacesFromSeason(selectedSeasonId);
  if (selectedSeasonId === null)
    return <Warning description={t('races.no_season_active')} />;
  return <SingleSeason season={season} races={races} />;
};

const RacesInfoBasic = (props: Partial<SectionProps>): JSX.Element => {
  return (
    <Section
      {...props}
      title={t('races.info_basic.title')}
      content={
        <Flex column gap={8}>
          <div>{t('races.info_basic1')}</div>
          <div>{t('races.info_basic2.title')}</div>
          <ul
            style={{
              margin: 0,
              paddingLeft: 'var(--size-24)',
              textAlign: 'left',
            }}>
            <li>
              <span style={{ fontWeight: 600 }}>
                {t('races.info_basic2.time_based')}
              </span>{' '}
              {t('races.info_basic2.time_based.desc')}
            </li>
            <li>
              <span style={{ fontWeight: 600 }}>
                {t('races.info_basic2.time_based')}
              </span>{' '}
              {t('races.info_basic2.time_based.desc')}
            </li>
          </ul>
          <div>{t('races.info_basic3')}</div>
        </Flex>
      }
    />
  );
};

const RacesInfoPoints = (props: Partial<SectionProps>): JSX.Element => {
  // TODO Lokalize the text below
  return (
    <Section
      {...props}
      title={t('races.info_points.title')}
      content={
        <Flex column gap={8}>
          <div>
            When you participate in a race, your final points for this
            particular race equal{' '}
            <span style={{ fontWeight: 'bold' }}>your place minus 1</span>.
          </div>
          <div>
            If you got disqualified, DNF'd or did not participate in a race at
            all, your final points will be equal to{' '}
            <span style={{ fontWeight: 'bold' }}>
              number of participants who finished the race
            </span>
            .
          </div>
          <div>
            The <span style={{ fontWeight: 'bold' }}>less</span> points you have
            in the season, the{' '}
            <span style={{ fontWeight: 'bold' }}>higher</span> you are placed.
          </div>
        </Flex>
      }
    />
  );
};

const RacesInfoJoin = (props: Partial<SectionProps>): JSX.Element => {
  // TODO Localize the text below
  return (
    <Section
      {...props}
      title={t('races.info_join.title')}
      content={
        <Flex column gap={8}>
          <div>
            Races take place in{' '}
            <a href="https://discord.com/invite/NjAeT53kVb" target="_blank">
              our Discord server
            </a>{' '}
            and require you to be a member of MasochistME community.
          </div>
          <div>
            <a
              href="https://abiding-washer-fc3.notion.site/Races-6fe4971a56194039b85807adf2077262"
              target="_blank">
              <Flex align gap={8}>
                {t('races.info_join.link')} <Icon icon="ExternalLink" />
              </Flex>
            </a>
          </div>
        </Flex>
      }
    />
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  width: 100%;
  gap: var(--size-16);
`;
