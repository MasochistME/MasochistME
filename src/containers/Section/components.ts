import styled from 'styled-components';

import { colors, fonts } from 'shared/theme';

export const UpdateProgressBar = styled.div`
	position: absolute;
	width: 0%;
	height: 100%;
	padding: 0 !important;
	align-self: flex-start;
	background-color: ${colors.newMediumGrey};
`;

export const UpdateProgressBarBorder = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 50%;
	height: 40px;
	padding: 0 !important;
	background-color: ${colors.superDarkGrey};
`;

export const UpdateProgressBarPercentage = styled.div`
	position: absolute;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	color: ${colors.superLightGrey};
`;

export const SmallEvent = styled.p`
	width: 100%;
	margin: 0px;
	box-sizing: border-box;
`;

export const EventLink = styled.span`
	cursor: pointer;
	&:hover {
		color: ${colors.white};
	}
`;

export const UpdateButton = styled.div`
	width: 50%;
`;
