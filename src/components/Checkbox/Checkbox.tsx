import React from 'react';
import styled from 'styled-components';

import { colors } from 'shared/theme';
import { Flex } from '../Flex';
import { Tooltip } from '../Tooltip';

type Props<T extends string> = {
	icon: string;
	itemDescription?: string;
	itemType: T;
	visibleItems: T[];
	setVisibleItems: (visibleItems: T[]) => void;
};

export const Checkbox = <T extends string>(props: Props<T>): JSX.Element => {
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
					<span>
						{isChecked ? 'Hide' : 'Show'} items of type {<i className={icon} />}
					</span>
					{itemDescription && <span>({itemDescription})</span>}
				</Flex>
			}>
			<StyledCheckbox align justify>
				<input
					type="checkbox"
					name={`checkbox-${itemType}`}
					value={itemType}
					checked={isChecked}
					id={`item-checkbox-${itemType}`}
					onChange={changeItemVisibility}
				/>
				<label className="checkbox-label" htmlFor={`item-checkbox-${itemType}`}>
					<i className={icon} />
				</label>
			</StyledCheckbox>
		</Tooltip>
	);
};

const StyledCheckbox = styled(Flex)`
	padding: 4px;
	box-sizing: border-box;
	max-height: 44px;
	input {
		display: none;
		&:not(:checked) + label {
			color: ${colors.newMediumGrey};
		}
	}
	label {
		margin: 0;
		padding: 0;
		font-size: 28px;
	}
	& > * {
		cursor: pointer;
	}
	&:hover {
		color: ${colors.white};
	}
`;
