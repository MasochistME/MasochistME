import styled from 'styled-components';

import { Icon, Menu, QueryBoundary, Size, Warning } from 'components';
import { ColorTokens, fonts, media, useTheme } from 'styles';
import { useRacesFromSeason } from 'hooks';
import { useEffect } from 'react';

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
								Select a season...
								<StyledIcon
									icon="ChevronDown"
									size={Size.TINY}
									isOpen={false}
								/>
							</StyledSeasonTitle>
						)}
					/>
				}
				errorFallback={<Warning description="Could not load season list" />}>
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
		{ value: 'Active seasons', isSubheader: true },
		...optionsSeasonsActive,
		{ value: 'Past seasons', isSubheader: true },
		...optionsSeasonsDone,
	];

	return (
		<Menu
			options={options}
			setSelectedOption={setSelectedSeasonId}
			placeholder="Select a season..."
			loadElement="Loading seasons..."
			anchorElement={(isOpen: boolean) => (
				<StyledSeasonTitle colorTokens={colorTokens}>
					{season?.name ?? 'Select a season...'}
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
	gap: 8px;
`;

const StyledSeasonTitle = styled.h2<{ colorTokens: ColorTokens }>`
	font-family: ${fonts.Dosis};
	display: flex;
	margin: 0;
	align-items: center;
	font-size: 24px;
	text-align: left;
	gap: 16px;
	padding: 8px 16px;
	border-radius: 64px;
	background-color: ${({ colorTokens }) =>
		colorTokens['semantic-color--interactive']};
`;

const StyledIcon = styled(Icon)<{ isOpen: boolean }>`
	transition: transform 0.5s;
	transform: ${({ isOpen }) => (!isOpen ? 'rotate(0)' : 'rotate(-180deg)')};
`;
