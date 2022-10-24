import Tippy from '@tippyjs/react/headless';
import styled from 'styled-components';

import { colors, media } from 'shared/theme';
import { Flex } from '../Flex';

type Props = {
	content: React.ReactNode;
	children: React.ReactElement;
};
export const Tooltip = (props: Props) => {
	const { content, children } = props;
	if (!content) return children;
	return (
		<Tippy
			render={attrs => (
				<StyledTooltip column {...attrs}>
					{content}
				</StyledTooltip>
			)}>
			{children}
		</Tippy>
	);
};

const StyledTooltip = styled(Flex)`
	padding: 8px;
	color: ${colors.superLightGrey};
	background-color: ${colors.superDarkGrey};
	border-radius: 8px;
	border: 1px solid ${colors.lightGrey};
	text-align: left;
	max-width: ${media.bigPhones};
`;
