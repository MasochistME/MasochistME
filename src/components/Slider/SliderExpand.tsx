import React from 'react';
import styled from 'styled-components';

import { Button, IconType, Size, Slider } from 'components';
import { ColorTokens, useTheme } from 'styles';

type Props = {
	children: React.ReactElement<typeof Slider>;
	iconExpand: IconType;
	showSlider: boolean;
	setShowSlider: (showSlider: boolean) => void;
};
export const SliderExpand = (props: Props) => {
	const { children, iconExpand, showSlider, setShowSlider } = props;
	const { colorTokens } = useTheme();
	const handleShowSliderClick = () => {
		setShowSlider(!showSlider);
	};

	return (
		<StyledWrapper
			className={showSlider ? 'expanded' : ''}
			colorTokens={colorTokens}>
			<StyledExpand className={showSlider ? 'expanded' : ''}>
				{children}
			</StyledExpand>
			<Button
				icon={iconExpand}
				size={Size.BIG}
				toggled={showSlider}
				onClick={handleShowSliderClick}
			/>
		</StyledWrapper>
	);
};

const StyledWrapper = styled.div<{ colorTokens: ColorTokens }>`
	display: flex;
	align-items: center;
	background-color: ${({ colorTokens }) => colorTokens['core-extra-bg']};
	padding: var(--size-4);
	border-radius: var(--border-radius-32);
	&.expanded {
		gap: var(--size-4);
	}
`;

const StyledExpand = styled.div`
	visibility: hidden;
	width: 0;
	opacity: 0;
	transition: width 0.1s linear, opacity 0.1s linear;
	/* overflow: hidden; */

	&.expanded {
		visibility: visible;
		width: 20rem;
		opacity: 1;
	}
`;
