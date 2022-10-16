import styled from 'styled-components';
import { colors, fonts } from 'shared/theme';

export const CustomButton = styled.button`
	background-color: ${colors.superDarkGrey};
	color: ${colors.superLightGrey};
	border: none;
	font-family: ${fonts.Dosis};
	letter-spacing: 0.3em;
	text-transform: uppercase;
	height: 40px;
	font-size: 1.3em;
	cursor: pointer;
	&:hover {
		background-color: ${colors.newMediumGrey};
	}
`;
