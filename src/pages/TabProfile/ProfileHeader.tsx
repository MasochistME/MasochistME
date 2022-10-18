import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Member } from '@masochistme/sdk/dist/v1/types';

import { log } from 'utils';
import { AppContext } from 'shared/store/context';
import { Wrapper, Flex, Spinner, CustomButton } from 'components';
import {
	Avatar,
	EmptyAvatar,
	Basic,
	Patron,
	UpdateDate,
	UpdateMsg,
} from './components';

type Props = {
	member?: Member;
	error: boolean;
};

export const ProfileHeader = (props: Props): JSX.Element => {
	const { member } = props;
	const { path } = useContext(AppContext);

	const [updating, setUpdating] = useState(false);
	const [message, setMessage] = useState('');

	const description: string =
		member?.description ??
		'Currently there is no info provided about this user.';

	const patron = useSelector((state: any) =>
		state.patrons.find((tier: any) =>
			tier.list.find((p: any) => member?.steamId === p.steamid)
				? { tier: tier.tier, description: tier.description }
				: false,
		),
	);

	const lastUpdated = 0; // TODO Get real last update date

	// TODO isDisabled is temporary for the dev environment, remove in prod
	const sendUpdateRequest = (steamId?: string, isDisabled?: boolean) => {
		if (!steamId || isDisabled) return;

		setMessage('Updating... refresh in a few minutes');
		setUpdating(true);

		const url = `${path}/api/users/user/${steamId}/update`;
		axios
			.get(url)
			.then(res => {
				res.data && setMessage(res.data);
			})
			.catch(log.WARN);
	};

	return (
		<Wrapper type="description">
			<div
				className="page-description"
				style={{ paddingBottom: '0', marginBottom: '0' }}>
				<Flex row align style={{ justifyContent: 'space-between' }}>
					<h1 style={{ margin: '0' }}>
						<a
							href={`https://steamcommunity.com/profiles/${member?.steamId}`}
							target="_blank"
							rel="noopener noreferrer">
							<i className="fab fa-steam" style={{ marginRight: '10px' }} />
							{member?.name ?? 'Loading...'}
						</a>
					</h1>
					{patron && (
						<Patron
							title={`This user is a tier ${
								patron?.description?.toUpperCase() ?? 'Loading...'
							} supporter`}>
							<i className="fas fa-medal" />{' '}
							{patron?.description?.toUpperCase() ?? 'Loading...'}{' '}
						</Patron>
					)}
				</Flex>
				<UpdateDate>
					Last updated:{' '}
					{member?.lastUpdated
						? new Date(member?.lastUpdated).toLocaleString()
						: 'Loading...'}
					{Date.now() - lastUpdated > 3600000 ? (
						updating ? (
							<UpdateMsg>{message}</UpdateMsg>
						) : (
							<CustomButton
								onClick={() => sendUpdateRequest(member?.steamId, true)}>
								Update
							</CustomButton>
						)
					) : (
						<button
							className="custom-button button-blocked"
							title={`${Number(
								(3600000 - (Date.now() - lastUpdated)) / 60000,
							)} minutes till you can update again`}>
							Update
						</button>
					)}
				</UpdateDate>
				<Basic>
					{member?.avatar ? (
						<Avatar
							src={member?.avatar}
							tier={Number(patron?.tier)}
							alt="avatar"
						/>
					) : (
						<EmptyAvatar>
							<Spinner />
						</EmptyAvatar>
					)}
					<div>{description}</div>
				</Basic>
			</div>
		</Wrapper>
	);
};
