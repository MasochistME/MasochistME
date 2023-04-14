import styled from 'styled-components';

import { Flex, Icon as MMEIcon } from 'components';
import { Size } from 'components';
import { media, ColorTokens, useTheme } from 'styles';

const Description = styled.div`
	display: inline-block;
	width: 100%;
	line-height: var(--size-15);
	text-align: left;
	& > * {
		margin-right: var(--size-4);
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

const Icons = styled(Flex)`
	gap: var(--size-8);
`;

const Image = styled.img`
	height: ${Size.SMALL}rem;
	max-height: ${Size.SMALL}rem;
`;

type Props = {
	children: React.ReactNode;
	onClick?: () => void;
};
const Link = (props: Props) => {
	const { children, onClick } = props;
	const { colorTokens } = useTheme();
	return (
		<StyledHistoryLogLink colorTokens={colorTokens} onClick={onClick}>
			{children}
		</StyledHistoryLogLink>
	);
};

const StyledHistoryLogLink = styled.span<{ colorTokens: ColorTokens }>`
	font-weight: bold;
	cursor: pointer;
	&:hover {
		color: ${({ colorTokens }) => colorTokens['common-color--white']};
	}
`;

const Icon = (props: React.ComponentProps<typeof MMEIcon>) => (
	<div style={{ display: 'inline-block' }}>
		<MMEIcon size={Size.MICRO} {...props} />
	</div>
);

const Logo = () => {
	const { LOGO_URL_STATIC } = useTheme();
	return <Image alt="masochistme-logo" src={LOGO_URL_STATIC} />;
};

const Summary = styled(Flex)`
	min-width: 13rem;
	justify-content: space-between;
	align-items: center;
	gap: var(--size-4);
	& > i {
		width: var(--size-20);
		box-sizing: border-box;
	}
`;

export { Description, Icons, Image, Link, Icon, Logo, Summary };
