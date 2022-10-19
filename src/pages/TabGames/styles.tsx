import styled from 'styled-components';
import { colors } from 'shared/theme';

export const Info = styled.div`
	width: 100%;
	height: 100%;
	padding: 5px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	overflow: hidden;
	opacity: 0;
	background-color: rgba(0, 0, 0, 0);
	color: ${colors.superLightGrey};
	transition: background-color linear 0.5s, opacity 0.5s;
	&:hover {
		opacity: 1;
		background-color: ${colors.superDarkGrey}dd;
	}
`;

export const Desc = styled.div`
	font-size: 0.85em;
`;

export const Title = styled.div``;

export const Rating = styled.div``;

export const Img = styled.div.attrs(
	({ extended, src }: { extended?: boolean; src: string }) => {
		const style: any = {
			backgroundImage: `url(${src})`,
		};
		if (extended) {
			style.display = 'none';
		}
		return { style };
	},
)<{ extended?: boolean; src: string }>`
	display: block;
	width: 300px;
	height: 145px;
	background-size: 300px;
	background-position: center;
	background-repeat: no-repeat;
	text-align: center;
	border: 3px solid ${colors.superLightGrey};
	box-sizing: border-box;
	cursor: pointer;
	transition: background-size ease-out 0.5s;
	&:hover {
		background-size: 400px;
	}
`;
