import React from 'react';
import { TierId } from '@masochistme/sdk/dist/v1/types';

import { useAppContext } from 'shared/store/context';
import { getTierIcon } from 'utils';
import { useTiers } from 'sdk';

type Props = {
	tier: TierId;
};

export const CheckBoxGameChoice = (props: Props): JSX.Element => {
	const { tier } = props;

	const { visibleTiers, setVisibleTiers } = useAppContext();
	const { tiersData } = useTiers();

	const icon = getTierIcon(tier, tiersData);

	const changeRatingVisibility = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		if (event.target.checked) setVisibleTiers([...visibleTiers, tier]);
		else setVisibleTiers(visibleTiers.filter(t => t !== tier));
	};

	const isChecked = visibleTiers.includes(tier);

	return (
		<div>
			<input
				type="checkbox"
				name={`checkbox-${tier}`}
				value={tier}
				checked={isChecked}
				id={`game-choice-${tier}`}
				className="game-choice-checkbox"
				onChange={changeRatingVisibility}
				style={{ display: 'none' }}
			/>
			<label className="checkbox-label" htmlFor={`game-choice-${tier}`}>
				<i className={icon}></i>
			</label>
		</div>
	);
};
