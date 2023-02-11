import styled from 'styled-components';

import { Flex } from 'components';
import { useRacesFromPastSeasons } from 'hooks';
import { ColorTokens, useTheme } from 'styles';

import { SingleSeason } from './SingleSeason';

export const TabPastSeasons = (): JSX.Element => {
	const { pastSeasons, pastSeasonRaces } = useRacesFromPastSeasons();
	const { colorTokens } = useTheme();

	return (
		<StyledPastSeasons column colorTokens={colorTokens}>
			{pastSeasons.map(season => {
				const seasonRaces = pastSeasonRaces.filter(
					race => race.season === String(season._id),
				);
				return <SingleSeason season={season} races={seasonRaces} />;
			})}
		</StyledPastSeasons>
	);
};

const StyledPastSeasons = styled(Flex)<{ colorTokens: ColorTokens }>`
	width: 100%;
	& > *:not(:last-child) {
		box-sizing: border-box;
		margin-bottom: 16px;
		padding-bottom: 16px;
		border-bottom: 8px solid
			${({ colorTokens }) => colorTokens['semantic-color--idle']};
	}
`;
