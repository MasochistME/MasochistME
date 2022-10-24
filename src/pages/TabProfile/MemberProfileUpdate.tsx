import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { Member } from '@masochistme/sdk/dist/v1/types';

import { useUpdateMemberMutation } from 'sdk';
import { media } from 'shared/theme';
import { Alert, Flex, Tooltip, Button } from 'components';

type Props = {
	member?: Member;
};

export const MemberProfileUpdate = (props: Props) => {
	const { member } = props;
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const handleMemberUpdate = () => {
		mutate({ shouldUpdate: true });
		setIsOpen(true);
	};

	const { mutate, data: memberUpdateData } = useUpdateMemberMutation(
		member?.steamId,
	);

	useEffect(() => {
		const response = memberUpdateData?.message ?? 'Please wait...';
		if (response) setMessage(response);
	}, [memberUpdateData]);

	const lastUpdate =
		new Date(member?.lastUpdated ?? 0).getTime() === 0
			? 'never'
			: dayjs(member?.lastUpdated).fromNow();

	const lastUpdateDetails =
		new Date(member?.lastUpdated ?? 0).getTime() === 0
			? 'This member was never updated.'
			: dayjs(member?.lastUpdated).format('D MMM YYYY, H:mm:ss');

	return (
		<StyledMemberProfileUpdate>
			<Tooltip content={lastUpdateDetails}>
				<Flex column alignItems="flex-end" fontSize="0.8em">
					<span>Last updated:</span>
					<span style={{ fontStyle: 'italic' }}>{lastUpdate}</span>
				</Flex>
			</Tooltip>
			<Button
				label="Update"
				icon="fas fa-refresh"
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
	gap: 12px;
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;
