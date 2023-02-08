import styled from 'styled-components';

import { Flex, Icon, IconType } from 'components';
import { Size } from 'components';
import { media, ColorTokens, useTheme } from 'styles';

type Props = {
	children: React.ReactNode;
	onClick?: () => void;
};
export const BaseEvent = (props: Pick<Props, 'children'>) => {
	const { children } = props;
	return (
		<Flex align justifyContent="space-between" width="100%" gap={6}>
			{children}
		</Flex>
	);
};

BaseEvent.Link = (props: Props) => {
	const { children, onClick } = props;
	const { colorTokens } = useTheme();
	return (
		<StyledBaseEventLink colorTokens={colorTokens} onClick={onClick}>
			{children}
		</StyledBaseEventLink>
	);
};

const StyledBaseEventLink = styled.span<{ colorTokens: ColorTokens }>`
	font-weight: bold;
	cursor: pointer;
	&:hover {
		color: ${({ colorTokens }) => colorTokens['common-color--white']};
	}
`;

BaseEvent.Logo = () => {
	const { LOGO_URL_STATIC } = useTheme();
	return <BaseEvent.Image alt="masochistme-logo" src={LOGO_URL_STATIC} />;
};

BaseEvent.Image = styled.img`
	height: ${Size.SMALL}px;
	max-height: ${Size.SMALL}px;
`;

BaseEvent.Description = styled.div`
	display: inline-block;
	width: 100%;
	line-height: 15px;
	text-align: left;
	gap: 4px;
	& > * {
		margin-right: 4px;
		vertical-align: middle;
	}
	@media (max-width: ${media.bigPhones}) {
		display: none;
	}
	i {
		display: flex;
		align-items: center;
		justify-content: center;
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

BaseEvent.Icon = (props: React.ComponentProps<typeof Icon>) => (
	<div style={{ display: 'inline-block' }}>
		<Icon size={Size.MICRO} {...props} />
	</div>
);

BaseEvent.Icons = styled(Flex)`
	gap: 8px;
`;
