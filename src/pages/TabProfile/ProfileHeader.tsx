import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { log } from 'shared/helpers';
import { AppContext } from 'shared/store/context';
import { Wrapper, Flex, Spinner, CustomButton } from 'components';
import {
	Avatar,
	EmptyAvatar,
	Basic,
	Patron,
	UpdateDate,
	UpdateMsg,
	InputDescription,
} from './components';

ProfileHeader.Avatar = Avatar;
ProfileHeader.EmptyAvatar = EmptyAvatar;
ProfileHeader.Basic = Basic;
ProfileHeader.Patron = Patron;
ProfileHeader.UpdateDate = UpdateDate;
ProfileHeader.UpdateMsg = UpdateMsg;
ProfileHeader.InputDescription = InputDescription;

type Props = {
	user: any;
	error: boolean;
};

export default function ProfileHeader(props: Props): JSX.Element {
	const { user } = props;
	const { path } = useContext(AppContext);
	const [updating, setUpdating] = useState(false);
	const [message, setMessage] = useState('');
	const description: string =
		user?.description ?? 'Currently there is no info provided about this user.';

	const patron = useSelector((state: any) =>
		state.patrons.find((tier: any) =>
			tier.list.find((p: any) => user?.id === p.steamid)
				? { tier: tier.tier, description: tier.description }
				: false,
		),
	);

	const sendUpdateRequest = (id: any) => {
		setMessage('Updating... refresh in a few minutes');
		setUpdating(true);

		const url = `${path}/api/users/user/${id}/update`;
		axios
			.get(url)
			.then((res: any) => {
				if (res.data) {
					setMessage(res.data);
				}
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
							href={`https://steamcommunity.com/profiles/${user?.id}`}
							target="_blank"
							rel="noopener noreferrer">
							<i className="fab fa-steam" style={{ marginRight: '10px' }} />
							{user?.name ?? 'Loading...'}
						</a>
					</h1>
					{patron ? (
						<ProfileHeader.Patron
							title={`This user is a tier ${
								patron?.description?.toUpperCase() ?? 'Loading...'
							} supporter`}>
							<i className="fas fa-medal" />{' '}
							{patron?.description?.toUpperCase() ?? 'Loading...'}{' '}
						</ProfileHeader.Patron>
					) : (
						''
					)}
				</Flex>
				<ProfileHeader.UpdateDate>
					{
						<span>{`Last updated: ${
							user?.updated
								? new Date(user?.updated).toLocaleString()
								: 'Loading...'
						}`}</span>
					}
					{Date.now() - user?.updated > 3600000 ? (
						updating ? (
							<ProfileHeader.UpdateMsg>{message}</ProfileHeader.UpdateMsg>
						) : (
							<CustomButton onClick={() => sendUpdateRequest(user?.id)}>
								Update
							</CustomButton>
						)
					) : (
						<button
							className="custom-button button-blocked"
							title={`${Number(
								(3600000 - (Date.now() - user?.updated)) / 60000,
							)} minutes till you can update again`}>
							Update
						</button>
					)}
				</ProfileHeader.UpdateDate>
				<ProfileHeader.Basic>
					{user?.avatar ? (
						<ProfileHeader.Avatar
							src={user?.avatar}
							tier={Number(patron?.tier)}
							alt="avatar"
						/>
					) : (
						<ProfileHeader.EmptyAvatar>
							<Spinner />
						</ProfileHeader.EmptyAvatar>
					)}
					<div>{description}</div>
				</ProfileHeader.Basic>
			</div>
		</Wrapper>
	);
}