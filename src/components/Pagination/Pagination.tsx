import { Flex } from 'components/Flex';
import { useMixpanel } from 'hooks';
import styled from 'styled-components';

import { useTheme, ColorTokens } from 'styles';

type Props = {
	isCompact?: boolean;
	nrOfItems: number;
	activeIndex: number;
	setActiveIndex: (activeIndex: number) => void;
	trackId?: string;
};

export const Pagination = (props: Props) => {
	const {
		isCompact = false,
		nrOfItems,
		activeIndex,
		setActiveIndex,
		trackId,
	} = props;
	const { colorTokens } = useTheme();
	const { track } = useMixpanel();

	const onCarouselPaginationClick = (index: number) => {
		setActiveIndex(index);
		if (trackId) track(`${trackId}.click`);
	};

	return (
		<StyledPagination>
			{new Array(nrOfItems).fill(null).map((_, index) => (
				<StyledPaginationItem
					colorTokens={colorTokens}
					isActive={index === activeIndex}
					isCompact={isCompact}
					onClick={() => onCarouselPaginationClick(index)}
				/>
			))}
		</StyledPagination>
	);
};

enum Width {
	DEFAULT = 24,
	COMPACT = 18,
}

const StyledPagination = styled(Flex)`
	width: 100%;
	justify-content: center;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
`;

const StyledPaginationItem = styled.div<{
	colorTokens: ColorTokens;
	isActive?: boolean;
	isCompact?: boolean;
}>`
	min-width: ${({ isCompact }) =>
		isCompact ? Width.COMPACT : Width.DEFAULT}px;
	min-height: ${({ isCompact }) =>
		isCompact ? Width.COMPACT : Width.DEFAULT}px;
	max-width: ${({ isCompact }) =>
		isCompact ? Width.COMPACT : Width.DEFAULT}px;
	max-height: ${({ isCompact }) =>
		isCompact ? Width.COMPACT : Width.DEFAULT}px;
	border-radius: ${({ isCompact }) =>
		isCompact ? Width.COMPACT : Width.DEFAULT}px;
	margin-bottom: 0;
	cursor: pointer;
	background-color: ${({ colorTokens, isActive }) =>
		isActive
			? colorTokens['semantic-color--active']
			: colorTokens['semantic-color--interactive']};
`;
