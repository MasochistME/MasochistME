import { Flex } from 'components/Flex';
import styled from 'styled-components';

import { useTheme, ColorTokens } from 'styles';

type Props = {
	nrOfItems: number;
	activeIndex: number;
	setActiveIndex: (activeIndex: number) => void;
};

export const Pagination = (props: Props) => {
	const { nrOfItems, activeIndex, setActiveIndex } = props;
	const { colorTokens } = useTheme();

	const onCarouselPaginationClick = (index: number) => {
		setActiveIndex(index);
	};

	return (
		<StyledPagination>
			{new Array(nrOfItems).fill(null).map((_, index) => (
				<StyledPaginationItem
					colorTokens={colorTokens}
					isActive={index === activeIndex}
					onClick={() => onCarouselPaginationClick(index)}
				/>
			))}
		</StyledPagination>
	);
};

const WIDTH = 24;

const StyledPagination = styled(Flex)`
	width: 100%;
	justify-content: center;
	align-items: center;
	gap: 8px;
`;

const StyledPaginationItem = styled.div<{
	colorTokens: ColorTokens;
	isActive?: boolean;
}>`
	min-width: ${WIDTH}px;
	min-height: ${WIDTH}px;
	max-width: ${WIDTH}px;
	max-height: ${WIDTH}px;
	border-radius: ${WIDTH}px;
	margin-bottom: 0;
	cursor: pointer;
	background-color: ${({ colorTokens, isActive }) =>
		isActive
			? colorTokens['semantic-color--active']
			: colorTokens['semantic-color--interactive']};
`;
