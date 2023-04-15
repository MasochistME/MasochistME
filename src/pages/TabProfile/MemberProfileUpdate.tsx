import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { Member, PatronTier } from '@masochistme/sdk/dist/v1/types';

import { useUpdateMemberMutation, useMemberLeaderboards } from 'sdk';
import { media } from 'styles';
import { getHumanReadableDate } from 'utils';
import { Alert, Flex, Tooltip, Button } from 'components';
import { Variant } from 'components/Button/types';

type Props = {
	member?: Member;
};

export const MemberProfileUpdate = (props: Props) => {
	const { member } = props;
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');

	const { leaderData } = useMemberLeaderboards(member?.steamId);
	const { mutate, data: memberUpdateData } = useUpdateMemberMutation(
		member?.steamId,
	);

	const isHighestPatronTier = leaderData?.patreonTier === PatronTier.TIER4;
	const variant = isHighestPatronTier ? Variant.GOLDEN : Variant.DEFAULT;

	useEffect(() => {
		const response = memberUpdateData?.message ?? 'Please wait...';
		if (response) setMessage(response);
	}, [memberUpdateData]);

	const handleMemberUpdate = () => {
		mutate({ shouldUpdate: true });
		setIsOpen(true);
	};

	const lastUpdate =
		new Date(member?.lastUpdated ?? 0).getTime() === 0
			? 'never'
			: dayjs(member?.lastUpdated).fromNow();

	const lastUpdateDetails =
		new Date(member?.lastUpdated ?? 0).getTime() === 0
			? 'This member was never updated.'
			: getHumanReadableDate(member?.lastUpdated, true);

	return (
		<StyledMemberProfileUpdate>
			<Tooltip content={lastUpdateDetails}>
				<Flex column alignItems="flex-end" fontSize="var(--font-size-9)">
					<span>Last updated:</span>
					<span style={{ fontStyle: 'italic' }}>{lastUpdate}</span>
				</Flex>
			</Tooltip>
			<Button
				label="Update"
				icon="Refresh"
				variant={variant}
				onClick={handleMemberUpdate}
			/>
			<Alert
				message={message}
				severity="info"
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>
		</StyledMemberProfileUpdate>
	);
};

const StyledMemberProfileUpdate = styled(Flex)`
	align-items: center;
	gap: var(--size-12);
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;
