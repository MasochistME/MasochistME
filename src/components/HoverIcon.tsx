import React from 'react';
import styled from 'styled-components';
import { colors } from 'shared/theme';

type Props = {
	type: string;
	isActive: boolean;
	style?: any;
	onClick: () => any;
};

export const HoverIcon = (props: Props): JSX.Element => {
	const { type, isActive, style, onClick } = props;
	return (
		<StyledHoverIcon active={isActive} onClick={onClick} style={style}>
			<i className={type} />
		</StyledHoverIcon>
	);
};

const StyledHoverIcon = styled.div.attrs(
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
