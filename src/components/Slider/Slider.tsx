import MuiSlider from '@mui/material/Slider';
import styled from 'styled-components';

import { Flex, Icon, IconType, Size } from 'components';
import { ColorTokens, useTheme } from 'styles';

type Props = {
	label: string;
	iconLeft?: IconType;
	iconRight?: IconType;
	step?: number;
	defaultValue: number[];
	setValue: (value: number[]) => void;
};
export const Slider = (props: Props) => {
	const { colorTokens } = useTheme();
	const {
		label,
		step = 10,
		iconLeft,
		iconRight,
		defaultValue,
		setValue,
	} = props;

	const handleChange = (_event: Event, newValue: number | number[]) => {
		setValue(newValue as number[]);
	};

	return (
		<Wrapper>
			{iconLeft && <Icon icon={iconLeft} size={Size.TINY} />}
			<StyledSlider
				defaultValue={defaultValue}
				getAriaLabel={() => label}
				onChange={handleChange}
				valueLabelDisplay="auto"
				step={step}
				colorTokens={colorTokens}
			/>
			{iconRight && <Icon icon={iconRight} size={Size.TINY} />}
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex: 1 1 auto;
	width: 250px;
	max-width: 250px;
	height: 100%;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
`;
const StyledSlider = styled(MuiSlider)<{ colorTokens: ColorTokens }>`
	color: ${({ colorTokens }) => colorTokens['semantic-color--active']};
`;
