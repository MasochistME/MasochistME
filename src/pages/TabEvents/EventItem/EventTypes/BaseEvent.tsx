import styled from 'styled-components';

import { Flex } from 'components';
import { media, colors } from 'shared/theme';

type Props = {
	children: React.ReactNode;
};
export const BaseEvent = (props: Props) => {
	const { children } = props;
	return (
		<Flex align justifyContent="space-between" width="100%" gap={6}>
			{children}
		</Flex>
	);
};

BaseEvent.Image = styled.img`
	height: 35px;
	max-height: 35px;
	margin: 0 5px;
`;

BaseEvent.Description = styled.div`
	width: 100%;
	text-align: left;
	@media (max-width: ${media.bigPhones}) {
		display: none;
	}
`;

BaseEvent.Link = styled.span`
	cursor: pointer;
	&:hover {
		color: ${colors.white};
	}
`;

BaseEvent.Summary = styled(Flex)`
	min-width: 130px;
	justify-content: space-between;
	align-items: center;
	gap: 4px;
	& > i {
		width: 20px;
		box-sizing: border-box;
	}
`;

BaseEvent.Icons = styled(Flex)`
	gap: 8px;
`;
