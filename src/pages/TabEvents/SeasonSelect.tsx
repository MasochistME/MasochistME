import styled from 'styled-components';

import { Icon, Menu, Size } from 'components';
import { media } from 'styles';
import { useRacesFromSeason } from 'hooks';

type Props = {
	selectedSeasonId: string;
	setSelectedSeasonId: (selectedSeason: string) => void;
};
export const SeasonSelect = (props: Props) => {
	const { selectedSeasonId, setSelectedSeasonId } = props;
	const { season, seasonsActive, seasonsDone } =
		useRacesFromSeason(selectedSeasonId);

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
		{ value: 'Active seasons', isSubheader: true },
		...optionsSeasonsActive,
		{ value: 'Past seasons', isSubheader: true },
		...optionsSeasonsDone,
	];

	return (
		<StyledSelectWrapper>
			<Menu
				options={options}
				setSelectedOption={setSelectedSeasonId}
				placeholder="Select season..."
				anchorElement={(isOpen: boolean) => (
					<StyledSeasonTitle>
						{season?.name ?? 'Select season'}
						<StyledIcon icon="ChevronDown" size={Size.TINY} isOpen={isOpen} />
					</StyledSeasonTitle>
				)}
			/>
		</StyledSelectWrapper>
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
	gap: 8px;
`;

const StyledSeasonTitle = styled.h2`
	display: flex;
	margin: 0;
	align-items: center;
	font-size: 24px;
	gap: 16px;
`;

const StyledIcon = styled(Icon)<{ isOpen: boolean }>`
	transition: transform 0.5s;
	transform: ${({ isOpen }) => (!isOpen ? 'rotate(0)' : 'rotate(-180deg)')};
`;
