import styled from 'styled-components';
import { colors, fonts } from 'shared/theme';
import { Tooltip } from 'components';
import { Size } from 'utils';

type Props = {
	label?: string;
	icon?: string;
	iconPlacement?: 'left' | 'right';
	disabled?: boolean;
	tooltip?: React.ReactNode;
	size?: Size;
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const Button = (props: Props) => {
	const {
		label,
		icon,
		iconPlacement = 'left',
		disabled = false,
		tooltip,
		size = Size.MEDIUM,
		onClick,
	} = props;
	return (
		<Tooltip content={tooltip}>
			<StyledButton size={size} disabled={disabled} onClick={onClick}>
				{icon && iconPlacement === 'left' && <i className={icon} />}
				{label && <span>{label}</span>}
				{icon && iconPlacement === 'right' && <i className={icon} />}
			</StyledButton>
		</Tooltip>
	);
};

const StyledButton = styled.button<{ size: Size }>`
	margin: 0;
	padding: 0;
	border: none;
	gap: 8px;
	padding: 4px 12px;
	border-radius: 4px;
	font-size: ${({ size }) => {
		if (size === Size.TINY) return '8px';
		if (size === Size.SMALL) return '12px';
		if (size === Size.MEDIUM) return '18px';
		if (size === Size.BIG) return '24px';
		if (size === Size.LARGE) return '32px';
		return '18px';
	}};
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
