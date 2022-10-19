import styled from 'styled-components';
import { colors, fonts } from 'shared/theme';

type Props = {
	label?: string;
	icon?: string;
	iconPlacement?: 'left' | 'right';
	onClick: () => void;
};

export const Button = (props: Props) => {
	const { label, icon, iconPlacement = 'left', onClick } = props;
	return (
		<StyledIconButton onClick={onClick}>
			{icon && iconPlacement === 'left' && <i className={icon} />}
			{label && <span>{label}</span>}
			{icon && iconPlacement === 'right' && <i className={icon} />}
		</StyledIconButton>
	);
};

const StyledIconButton = styled.button`
	margin: 0;
	padding: 0;
	border: none;
	gap: 8px;
	padding: 4px 12px;
	border-radius: 4px;
	font-size: 18px;
	font-family: ${fonts.Raleway};
	background-color: black;
	color: ${colors.lightGrey};
	cursor: pointer;
	&:hover {
		color: ${colors.superLightGrey};
	}
	& > *:not(:last-child) {
		margin-right: 8px;
	}
`;
