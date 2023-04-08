import MuiSlider from '@mui/material/Slider';
import styled from 'styled-components';

import { Flex, Icon, IconType, Size } from 'components';
import { ColorTokens, useTheme } from 'styles';
import { SliderExpand } from './SliderExpand';

type Props = {
	getValueLabelFormat?: (value: number) => string;
	iconLeft?: IconType;
	iconRight?: IconType;
	step?: number;
	defaultValue: number[];
	setValue: (value: number[]) => void;
};
export const Slider = (props: Props) => {
	const { colorTokens } = useTheme();
	const {
		step = 10,
		iconLeft,
		iconRight,
		defaultValue,
		setValue,
		getValueLabelFormat,
	} = props;

	const handleChange = (_event: Event, newValue: number | number[]) => {
		setValue(newValue as number[]);
	};

	const optionalProps = {
		...(getValueLabelFormat && { getAriaValueText: getValueLabelFormat }),
		...(getValueLabelFormat && { valueLabelFormat: getValueLabelFormat }),
	};

	return (
		<Wrapper>
			{iconLeft && <Icon icon={iconLeft} size={Size.TINY} />}
			<StyledSlider
				defaultValue={defaultValue}
				onChange={handleChange}
				step={step}
				colorTokens={colorTokens}
				valueLabelDisplay="auto"
				{...optionalProps}
			/>
			{iconRight && <Icon icon={iconRight} size={Size.TINY} />}
		</Wrapper>
	);
};

Slider.Expand = SliderExpand;

const Wrapper = styled(Flex)`
	flex: 1 1 auto;
	width: 25rem;
	max-width: 100%;
	height: 100%;
	align-items: center;
	justify-content: space-between;
	gap: var(--size-16);
	padding: 0 var(--size-16);
`;

const StyledSlider = styled(MuiSlider)<{ colorTokens: ColorTokens }>`
	color: ${({ colorTokens }) => colorTokens['semantic-color--active']};

	& .MuiSlider-valueLabel {
		//
	}
`;
