import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import axios from 'axios';

import { useMemberById, useMemberLeaderboards } from 'sdk';
import { log, Size } from 'utils';
import { colors, media } from 'shared/theme';
import { AppContext } from 'context';
import { Flex, Spinner, Tooltip, Button } from 'components';
import { MemberAvatar } from 'containers';
import {
	Avatar,
	EmptyAvatar,
	Basic,
	Patron,
	UpdateDate,
	UpdateMsg,
} from './components';

type Props = {
	memberId: string;
};

export const MemberProfileHeader = (props: Props): JSX.Element => {
	const { memberId } = props;
	const { path } = useContext(AppContext);

	const {
		memberData: member,
		isLoading: isMemberLoading,
		isFetched: isMemberFetched,
	} = useMemberById(memberId);
	const { leaderData } = useMemberLeaderboards(memberId);

	const [updating, setUpdating] = useState(false);
	const [message, setMessage] = useState('');

	const isDisabled = false; // TODO disable when updated recently
	const description: string =
		member?.description ??
		'Currently there is no info provided about this user.';
	const patron = {
		description: 'SHEKELMASTER', // TODO get real patreon tier
	};

	// TODO isDisabled is temporary for the dev environment, remove in prod
	const handleMemberUpdate = () => {
		if (!memberId || isDisabled) return;

		setMessage('Updating... refresh in a few minutes');
		setUpdating(true);

		const url = `${path}/api/users/user/${memberId}/update`;
		axios
			.get(url)
			.then(res => {
				res.data && setMessage(res.data);
			})
			.catch(log.WARN);
	};

	return (
		<StyledMemberProfileHeader row>
			<MemberAvatar
				member={member}
				patronTier={leaderData?.patreonTier}
				size={Size.LARGE}
			/>
			<StyledMemberProfileDetails column>
				<Flex row align width="100%" justifyContent="space-between">
					<h1 style={{ margin: '0' }}>
						<a
							href={`https://steamcommunity.com/profiles/${member?.steamId}`}
							target="_blank"
							rel="noopener noreferrer">
							<i className="fab fa-steam" style={{ marginRight: '10px' }} />
							{member?.name ?? 'Loading...'}
						</a>
					</h1>
					<Flex row align gap={12}>
						<Tooltip
							content={dayjs(member?.lastUpdated).format(
								'D MMM YYYY, H:mm:ss',
							)}>
							<Flex column alignItems="flex-end" fontSize="0.8em">
								<span>Last updated:</span>
								<span style={{ fontStyle: 'italic' }}>
									{dayjs(member?.lastUpdated).fromNow()}
								</span>
							</Flex>
						</Tooltip>
						<Button
							label="Update"
							icon="fas fa-refresh"
							disabled={updating}
							onClick={() => handleMemberUpdate()}
						/>
					</Flex>
				</Flex>
				{leaderData?.patreonTier && (
					<Tooltip
						content={`This user is a tier ${
							patron?.description?.toUpperCase() ?? 'Loading...'
						} supporter`}>
						<Patron>
							<i className="fas fa-medal" />{' '}
							{patron?.description?.toUpperCase() ?? 'Loading...'}{' '}
						</Patron>
					</Tooltip>
				)}
				<StyledMemberProfileDescription>
					{description ?? 'Loading...'}
				</StyledMemberProfileDescription>
			</StyledMemberProfileDetails>
		</StyledMemberProfileHeader>
	);
};

const StyledMemberProfileHeader = styled(Flex)`
	max-width: 100%;
	margin-bottom: 10px;
	padding: 8px;
	gap: 16px;
	justify-content: space-between;
	align-items: flex-start;
	background-color: ${colors.black}66;
`;

const StyledMemberProfileDetails = styled(Flex)`
	max-width: 100%;
	flex: 1 1 100%;
	gap: 4px;
	align-items: flex-start;
	@media (max-width: ${media.tablets}) {
		display: none;
	}
`;

const StyledMemberProfileDescription = styled.div`
	max-width: 100%;
	overflow: hidden;
`;

// 	return (
// 		<Flex>
// 			<div
// 				className="page-description"
// 				style={{ paddingBottom: '0', marginBottom: '0' }}>
// 				<Flex row align justifyContent="space-between">
// 					<h1 style={{ margin: '0' }}>
// 						<a
// 							href={`https://steamcommunity.com/profiles/${member?.steamId}`}
// 							target="_blank"
// 							rel="noopener noreferrer">
// 							<i className="fab fa-steam" style={{ marginRight: '10px' }} />
// 							{member?.name ?? 'Loading...'}
// 						</a>
// 					</h1>
// 					{patron && (
// 						<Tooltip
// 							content={`This user is a tier ${
// 								patron?.description?.toUpperCase() ?? 'Loading...'
// 							} supporter`}>
// 							<Patron>
// 								<i className="fas fa-medal" />{' '}
// 								{patron?.description?.toUpperCase() ?? 'Loading...'}{' '}
// 							</Patron>
// 						</Tooltip>
// 					)}
// 				</Flex>
// 				<UpdateDate>
// 					Last updated:{' '}
// 					{member?.lastUpdated
// 						? new Date(member?.lastUpdated).toLocaleString()
// 						: 'Loading...'}
// 					{Date.now() - lastUpdated > 3600000 ? (
// 						updating ? (
// 							<UpdateMsg>{message}</UpdateMsg>
// 						) : (
// 							<CustomButton
// 								onClick={() => sendUpdateRequest(member?.steamId, true)}>
// 								Update
// 							</CustomButton>
// 						)
// 					) : (
// 						<Tooltip
// 							content={`${Number(
// 								(3600000 - (Date.now() - lastUpdated)) / 60000,
// 							)} minutes till you can update again`}>
// 							<button className="custom-button button-blocked">Update</button>
// 						</Tooltip>
// 					)}
// 				</UpdateDate>
// 				<Basic>
// 					{member?.avatar ? (
// 						<Avatar
// 							src={member?.avatar}
// 							tier={Number(patron?.tier)}
// 							alt="avatar"
// 						/>
// 					) : (
// 						<EmptyAvatar>
// 							<Spinner />
// 						</EmptyAvatar>
// 					)}
// 					<div>{description}</div>
// 				</Basic>
// 			</div>
// 		</Flex>
// 	);
// };
