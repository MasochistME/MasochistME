import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Tier, TierId } from '@masochistme/sdk/dist/v1/types';

import { useTiers } from 'sdk';
import { MemberLeaderboards, GameTierCheckbox } from 'containers';
import { Flex, Spinner, Switch } from 'components';
import { colors, fonts } from 'shared/theme';

type Props = { memberId: string };

export const MemberProfileGames = (props: Props) => {
	const { memberId } = props;
	const [visibleTiers, setVisibleTiers] = useState<TierId[]>([]);
	const [isHideCompleted, setIsHideCompleted] = useState<boolean>(false);
	const [isHideUnfinished, setIsHideUnfinished] = useState<boolean>(false);

	const { tiersData, isLoading, isFetched } = useTiers();

	useEffect(() => {
		if (isFetched) {
			const allTiers = tiersData.map(tier => tier.id);
			setVisibleTiers(allTiers);
		}
	}, [isFetched]);

	const handleHideCompleted = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsHideCompleted(event.target.checked);
	};
	const handleHideUnfinished = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsHideUnfinished(event.target.checked);
	};

	return (
		<Flex column width="100%">
			<StyledFilterGameTiers>
				<Flex row align gap={24} width="100%">
					<span style={{ fontSize: '1.5em' }}>Filter games</span>
					{isLoading && <Spinner />}
					{isFetched &&
						tiersData.map((tier: Tier) => (
							<GameTierCheckbox
								key={`checkbox-game-${tier.id}`}
								tierId={tier.id}
								visibleTiers={visibleTiers}
								setVisibleTiers={setVisibleTiers}
							/>
						))}
				</Flex>
				<StyledFilterGameSwitches column gap={8}>
					<Flex row align gap={16}>
						Hide completed{' '}
						<Switch checked={isHideCompleted} onChange={handleHideCompleted} />
					</Flex>
					<Flex row align gap={16}>
						Hide unfinished
						<Switch
							checked={isHideUnfinished}
							onChange={handleHideUnfinished}
						/>
					</Flex>
				</StyledFilterGameSwitches>
			</StyledFilterGameTiers>
			<MemberLeaderboards
				steamId={memberId}
				filter={{ tiers: visibleTiers, isHideCompleted, isHideUnfinished }}
			/>
		</Flex>
	);
};

const StyledFilterGameTiers = styled(Flex)`
	justify-content: space-between;
	align-items: center;
	font-family: ${fonts.Dosis};
	font-weight: bold;
	width: 100%;
	padding-bottom: 16px;
	text-transform: uppercase;
	span {
		color: ${colors.newMediumGrey};
	}
`;

const StyledFilterGameSwitches = styled(Flex)`
	font-size: 1em;
	word-wrap: nowrap;
	white-space: nowrap;
`;
