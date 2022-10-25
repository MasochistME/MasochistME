import styled from 'styled-components';
import { Tooltip } from 'components';

type Props = {
	hoverText: string;
};
export const IconInfo = (props: Props) => {
	const { hoverText } = props;

	return (
		<Tooltip content={hoverText}>
			<StyledIconInfo className="fas fa-question-circle" />
		</Tooltip>
	);
};

const StyledIconInfo = styled.i`
	font-size: 12px;
	margin-left: 6px;
`;
