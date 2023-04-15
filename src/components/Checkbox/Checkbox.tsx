import React from 'react';
import styled from 'styled-components';

import { useTheme, ColorTokens } from 'styles';

import { Size } from 'components/__utils';
import { Icon, IconType } from 'components/Icon';
import { Flex } from 'components/Flex';
import { Tooltip } from 'components/Tooltip';

type Props<T extends string> = {
	icon: IconType;
	itemDescription?: string;
	itemType: T;
	visibleItems: T[];
	setVisibleItems: (visibleItems: T[]) => void;
};

export const Checkbox = <T extends string>(props: Props<T>): JSX.Element => {
	const { colorTokens } = useTheme();
	const { icon, itemDescription, itemType, visibleItems, setVisibleItems } =
		props;

	const changeItemVisibility = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		if (event.target.checked) {
			setVisibleItems([...visibleItems, itemType]);
		} else {
			setVisibleItems(
				visibleItems.filter(item => {
					return item !== itemType;
				}),
			);
		}
	};

	const isChecked = visibleItems.includes(itemType);

	return (
		<Tooltip
			content={
				<Flex column>
					<Flex align gap={4}>
						{isChecked ? 'Hide' : 'Show'} items of type{' '}
						{<Icon icon={icon} size={Size.MICRO} />}
					</Flex>
					{itemDescription && <span>({itemDescription})</span>}
				</Flex>
			}>
			<StyledCheckbox align justify colorTokens={colorTokens}>
				<input
					type="checkbox"
					name={`checkbox-${itemType}`}
					value={itemType}
					checked={isChecked}
					id={`item-checkbox-${itemType}`}
					onChange={changeItemVisibility}
				/>
				<label className="checkbox-label" htmlFor={`item-checkbox-${itemType}`}>
					<Icon icon={icon} size={Size.SMALL} />
				</label>
			</StyledCheckbox>
		</Tooltip>
	);
};

const StyledCheckbox = styled(Flex)<{ colorTokens: ColorTokens }>`
	padding: var(--size-4);
	box-sizing: border-box;
	max-height: var(--size-44);

	input {
		display: none;
		&:not(:checked) + label {
			color: ${({ colorTokens }) => colorTokens['semantic-color--interactive']};
		}
	}
	label {
		margin: 0;
		padding: 0;
		font-size: var(--font-size-28);
	}
	& > * {
		cursor: pointer;
	}
	&:hover {
		color: ${({ colorTokens }) => colorTokens['semantic-color--link-normal']};
	}
`;
