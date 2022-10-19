import styled from 'styled-components';
import { colors, media } from 'shared/theme';

export const DetailsSummary = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
	justify-content: space-around;
	box-sizing: border-box;
	height: auto;
	padding: 10px;
	background-color: ${colors.darkBlueTransparent};
	@media (min-width: ${media.tablets}) {
		display: none !important;
	}
`;
