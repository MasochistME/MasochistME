import { colors } from 'shared/theme';
import styled from 'styled-components';

import { Size } from 'utils';
import { Flex } from '../Flex';
import { Tooltip } from '../Tooltip';

type Props = {
	title?: string;
	size?: Size;
	width?: string;
	height?: string;
};

export const BrokenImage = (props: Props) => {
	const { title, size, width, height } = props;

	return (
		<Tooltip content={title ?? 'I could not load :('}>
			<StyledBrokenImg fontSize={size ? size / 2 : '16px'}>
				<i className="fas fa-exclamation-triangle" />
			</StyledBrokenImg>
		</Tooltip>
	);
};

const StyledBrokenImg = styled(Flex)`
	box-sizing: border-box;
	align-items: center;
	justify-content: center;
`;
