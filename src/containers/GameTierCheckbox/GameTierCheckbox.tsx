import React from 'react';
import styled from 'styled-components';
import { TierId } from '@masochistme/sdk/dist/v1/types';

import { colors } from 'shared/theme';
import { getTierIcon } from 'utils';
import { useTiers } from 'sdk';
import { Flex, Tooltip } from 'components';

type Props = {
	tierId: TierId;
	visibleTiers: TierId[];
	setVisibleTiers: (visibleTiers: TierId[]) => void;
};

export const GameTierCheckbox = (props: Props): JSX.Element => {
	const { tierId, visibleTiers, setVisibleTiers } = props;
	const { tiersData } = useTiers();

	const icon = getTierIcon(tierId, tiersData);

	const changeRatingVisibility = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		if (event.target.checked) setVisibleTiers([...visibleTiers, tierId]);
		else setVisibleTiers(visibleTiers.filter(t => t !== tierId));
	};

	const isChecked = visibleTiers.includes(tierId);

	return (
		<Tooltip
			content={
				<span>
					{isChecked ? 'Hide' : 'Show'} games from tier {<i className={icon} />}
					.
				</span>
			}>
			<StyledCheckbox align justify>
				<input
					type="checkbox"
					name={`checkbox-${tierId}`}
					value={tierId}
					checked={isChecked}
					id={`game-checkbox-${tierId}`}
					onChange={changeRatingVisibility}
					style={{ display: 'none' }}
				/>
				<label className="checkbox-label" htmlFor={`game-checkbox-${tierId}`}>
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
`;
