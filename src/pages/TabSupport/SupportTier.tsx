import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Member, PatreonTier } from '@masochistme/sdk/dist/v1/types';

import { useMembers, usePatrons } from 'sdk';
import { Flex, Icon, IconType, Spinner } from 'components';
import { MemberAvatar, Section } from 'containers';
import { Size } from 'components';

type Props = {
	patreonTier: PatreonTier;
};

export const SupportTier = (props: Props): JSX.Element => {
	const navigate = useNavigate();
	const { patreonTier } = props;

	const { membersData } = useMembers();
	const { patronsData, isLoading, isFetched } = usePatrons();

	const patronsList = patronsData
		.filter(patron => patron.tier === patreonTier.id)
		.map(patron => {
			const member = membersData.find(
				m => m.steamId === patron.memberId || m.discordId === patron.memberId,
			) ?? {
				name: patron.username ?? undefined,
				avatar: patron.avatar ?? undefined,
			};
			return (
				<MemberAvatar
					key={`patron-${String(patron._id)}`}
					member={member}
					patronTier={patreonTier.id}
					size={Size.LARGE}
					onClick={() => handlePatronClick(member)}
				/>
			);
		});

	const handlePatronClick = (member: Partial<Member>) => {
		if (member.steamId) navigate(`/profile/${member.steamId}`);
	};

	if (isLoading) return <Spinner />;
	if (isFetched)
		return (
			<Section
				isCentered={false}
				title={
					<>
						<Icon icon={patreonTier.symbol as IconType} /> -{' '}
						{patreonTier.description}
					</>
				}
				content={
					<StyledSupportTierPatrons>{patronsList}</StyledSupportTierPatrons>
				}
			/>
		);
	return <Spinner />;
};

const StyledSupportTierPatrons = styled(Flex)`
	width: 100%;
	flex-wrap: wrap;
	gap: var(--size-16);
`;
