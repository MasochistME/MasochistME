import { useEffect } from 'react';
import styled from 'styled-components';

import { t } from 'i18n';
import { useRacesFromSeason } from 'hooks';
import { ColorTokens, media, useTheme } from 'styles';
import { Icon, Menu, QueryBoundary, Size, Warning } from 'components';

type Props = {
  selectedSeasonId: string | null;
  setSelectedSeasonId: (selectedSeason: string | null) => void;
};
export const SeasonSelect = (props: Props) => {
  const { colorTokens } = useTheme();
  return (
    <StyledSelectWrapper>
      <QueryBoundary
        fallback={
          <Menu
            anchorElement={() => (
              <StyledSeasonTitle colorTokens={colorTokens}>
                {t('races.seasons.select.placeholder')}
                <StyledIcon
                  icon="ChevronDown"
                  // TODO This sizing does not work, fix
                  size={Size.TINY}
                  isOpen={false}
                />
              </StyledSeasonTitle>
            )}
          />
        }
        errorFallback={
          <Warning description={t('races.seasons.select.could_not_load')} />
        }>
        <SeasonSelectBoundary {...props} />
      </QueryBoundary>
    </StyledSelectWrapper>
  );
};

const SeasonSelectBoundary = (props: Props) => {
  const { selectedSeasonId, setSelectedSeasonId } = props;
  const { colorTokens } = useTheme();
  const { season, seasonsActive, seasonsDone } =
    useRacesFromSeason(selectedSeasonId);

  useEffect(() => {
    const activeSeasonId = seasonsActive[0]
      ? String(seasonsActive[0]?._id)
      : null;
    setSelectedSeasonId(activeSeasonId);
  }, [seasonsActive]);

  const optionsSeasonsActive = seasonsActive.map(season => ({
    render: (
      <StyledOption>
        <Icon icon="HourglassHalf" /> {season.name}
      </StyledOption>
    ),
    onSelect: () => setSelectedSeasonId(String(season._id)),
    value: String(season._id),
    isSubheader: false,
  }));

  const optionsSeasonsDone = seasonsDone.map(season => ({
    render: (
      <StyledOption>
        <Icon icon="CalendarCheck" /> {season.name}
      </StyledOption>
    ),
    onSelect: () => setSelectedSeasonId(String(season._id)),
    value: String(season._id),
    isSubheader: false,
  }));

  const options = [
    { value: t('races.seasons.select.active'), isSubheader: true },
    ...optionsSeasonsActive,
    { value: t('races.seasons.select.past'), isSubheader: true },
    ...optionsSeasonsDone,
  ];

  return (
    <Menu
      options={options}
      setSelectedOption={setSelectedSeasonId}
      placeholder={t('races.seasons.select.placeholder')}
      loadElement={t('races.seasons.select.loading')}
      anchorElement={(isOpen: boolean) => (
        <StyledSeasonTitle colorTokens={colorTokens}>
          {season?.name ?? t('races.seasons.select.placeholder')}
          <StyledIcon icon="ChevronDown" size={Size.TINY} isOpen={isOpen} />
        </StyledSeasonTitle>
      )}
    />
  );
};

const StyledSelectWrapper = styled.div`
  display: flex;
  width: 50%;
  @media (max-width: ${media.smallNetbooks}) {
    width: 100%;
  }
`;

const StyledOption = styled.div`
  display: flex;
  align-items: center;
  gap: var(--size-8);
`;

const StyledSeasonTitle = styled.h2<{ colorTokens: ColorTokens }>`
  font-family: var(--font-dosis);
  display: flex;
  margin: 0;
  align-items: center;
  font-size: var(--font-size-20);
  text-align: left;
  min-width: 200px;
  gap: var(--size-16);
  padding: var(--size-6) var(--size-12);
  border-radius: var(--border-radius-64);
  background-color: ${({ colorTokens }) =>
    colorTokens['semantic-color--interactive']};
`;

const StyledIcon = styled(Icon)<{ isOpen: boolean }>`
  transition: transform 0.5s;
  transform: ${({ isOpen }) => (!isOpen ? 'rotate(0)' : 'rotate(-180deg)')};
`;
