import styled from 'styled-components';

import { Flex } from 'components';
import { Size } from 'utils';
import { media, colors } from 'shared/theme';

const LOGO = 'http://cdn.masochist.me/mme_logo.png';

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
	height: ${Size.SMALL}px;
	max-height: ${Size.SMALL}px;
`;

BaseEvent.Description = styled(Flex)`
	width: 100%;
	text-align: left;
	gap: 4px;
	@media (max-width: ${media.bigPhones}) {
		display: none;
	}
	i {
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;

BaseEvent.Link = styled.span`
	font-weight: bold;
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

BaseEvent.Logo = () => <BaseEvent.Image alt="masochistme-logo" src={LOGO} />;