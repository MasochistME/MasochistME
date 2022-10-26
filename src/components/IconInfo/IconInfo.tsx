import styled from 'styled-components';
import { Tooltip, Icon } from 'components';

type Props = {
	hoverText: string;
};
export const IconInfo = (props: Props) => {
	const { hoverText } = props;

	return (
		<Tooltip content={hoverText}>
			<StyledIconInfo icon="QuestionCircle" />
		</Tooltip>
	);
};

const StyledIconInfo = styled(Icon)`
	font-size: 12px;
	margin-left: 6px;
`;
