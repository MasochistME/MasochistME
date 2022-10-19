import styled from 'styled-components';
import { colors, fonts } from 'shared/theme';

type Props = {
	icon: string;
	onClick: () => void;
};

export const IconButton = (props: Props) => {
	const { icon, onClick } = props;
	return (
		<StyledIconButton onClick={onClick}>
			<i className={icon}></i>
		</StyledIconButton>
	);
};

const StyledIconButton = styled.button`
	background-color: black;
	border: none;
	font-family: ${fonts.Dosis};
	font-size: 24px;
	text-transform: uppercase;
	min-width: 48px;
	min-height: 48px;
	max-width: 48px;
	max-height: 48px;
	cursor: pointer;
	&:hover {
		background-color: ${colors.superDarkGrey};
		color: ${colors.lightGrey};
	}
`;
