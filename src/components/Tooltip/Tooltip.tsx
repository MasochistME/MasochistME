import Tippy from '@tippyjs/react/headless';
import styled from 'styled-components';

import { media, useTheme, ColorTokens } from 'styles';
import { Flex } from '../Flex';

type Props = {
	content: React.ReactNode;
	children: React.ReactElement;
};
export const Tooltip = (props: Props) => {
	const { colorTokens } = useTheme();
	const { content, children } = props;
	if (!content) return children;

	return (
		<Tippy
			render={attrs => (
				<StyledTooltip column colorTokens={colorTokens} {...attrs}>
					{content}
				</StyledTooltip>
			)}>
			{children}
		</Tippy>
	);
};

const StyledTooltip = styled(Flex)<{ colorTokens: ColorTokens }>`
	padding: var(--size-8);
	color: ${({ colorTokens }) => colorTokens['core-primary-text']};
	background-color: ${({ colorTokens }) => colorTokens['core-secondary-bg']};
	border-radius: var(--border-radius-8);
	border: var(--size-1) solid
		${({ colorTokens }) => colorTokens['core-secondary-text']};
	text-align: left;
	max-width: ${media.bigPhones};
`;
