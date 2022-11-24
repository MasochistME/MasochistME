import styled from 'styled-components';

import { Flex } from 'components';
import { useRacesFromActiveSeasons } from 'hooks';
import { ColorTokens, useTheme } from 'styles';

import { ActiveSeason } from './ActiveSeason';

export const TabCurrentSeason = (): JSX.Element => {
	const { activeSeasons, currentSeasonRaces, isLoading } =
		useRacesFromActiveSeasons();
	const { colorTokens } = useTheme();

	return (
		<StyledActiveSeasons column colorTokens={colorTokens}>
			{activeSeasons.map(season => {
				const seasonRaces = currentSeasonRaces.filter(
					race => race.season === String(season._id),
				);
				return (
					<ActiveSeason
						season={season}
						races={seasonRaces}
						isLoading={isLoading}
					/>
				);
			})}
		</StyledActiveSeasons>
	);
};

const StyledActiveSeasons = styled(Flex)<{ colorTokens: ColorTokens }>`
	& > *:not(:last-child) {
		box-sizing: border-box;
		margin-bottom: 16px;
		padding-bottom: 16px;
		border-bottom: 8px solid
			${({ colorTokens }) => colorTokens['semantic-color--idle']};
	}
`;
