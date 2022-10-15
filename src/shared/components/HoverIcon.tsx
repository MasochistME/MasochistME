import React from 'react';
import styled from 'styled-components';
import { colors } from 'shared/theme';

const HoverWrapper = styled.div.attrs(
	({ active, style }: { active: boolean; style?: any }) => {
		const newStyle: any = {
			...style,
			color: `${colors.newMediumGrey}`,
		};
		if (active) {
			newStyle.color = `${colors.superLightGrey}`;
		}
		return { style: newStyle };
	},
)<{ active: boolean; style?: any }>`
	padding: 12px;
	cursor: pointer;
	&:hover {
		color: ${colors.superLightGrey} !important;
	}
`;

type Props = {
	type: string;
	isActive: boolean;
	style?: any;
	onClick: () => any;
};

export default function HoverIcon(props: Props): JSX.Element {
	const { type, isActive, style, onClick } = props;
	return (
		<HoverWrapper active={isActive} onClick={onClick} style={style}>
			<i className={type} />
		</HoverWrapper>
	);
}
