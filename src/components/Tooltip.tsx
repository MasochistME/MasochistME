import Tippy from '@tippyjs/react/headless';
import { colors } from 'shared/theme';
import styled from 'styled-components';
import { Flex } from './layout';

type Props = {
	content: React.ReactNode;
	children: React.ReactElement;
};
export const Tooltip = (props: Props) => {
	const { content, children } = props;
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
`;
