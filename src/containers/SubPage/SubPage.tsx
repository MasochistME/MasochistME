import styled from 'styled-components';

import { useScrollToLocation } from 'hooks';
import { media } from 'styles';
import { Flex } from 'components';

type Props = {
	children: React.ReactNode;
};

export const SubPage = (props: Props) => {
	const { children } = props;

	useScrollToLocation();

	return <StyledSubPage>{children}</StyledSubPage>;
};

const StyledSubPage = styled(Flex)`
	flex: 1 1 auto;
	flex-direction: row;
	align-items: flex-start;
	padding: 16px;
	width: 100%;
	gap: 16px;
	box-sizing: border-box;
	@media (max-width: ${media.netbooks}) {
		flex-direction: column;
		align-items: center;
	}
`;
