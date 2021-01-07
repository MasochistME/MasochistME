/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';
import { colors } from 'shared/theme';
import { Wrapper, Flex } from 'shared/components';

const Patron = styled.div`
  cursor: help;
`;
const UpdateDate = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8em;
  margin-bottom: 5px;
`;
const Avatar = styled.img.attrs(({ tier }: { tier: number }) => {
  const style: any = {
    backgroundColor: colors.black,
  };
  if (tier === 1) {
    style.border = `5px solid ${colors.tier1}`;
  }
  if (tier === 2) {
    style.border = `5px solid ${colors.tier2}`;
  }
  if (tier === 3) {
    style.border = `5px solid ${colors.tier3}`;
  }
  if (tier === 4) {
    style.border = `5px solid ${colors.tier4}`;
  }
  return { style };
})<{ tier: number }>`
  width: 128px;
  min-width: 128px;
  height: 128px;
  min-height: 128px;
  margin: 15px;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 10px ${colors.black};
  padding: 2px;
`;
const Basic = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.superDarkGrey}48;
  margin-bottom: 10px;
  padding-right: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 5px ${colors.superDarkGrey};
  border-bottom: 1px solid ${colors.mediumGrey};
  border-right: 1px solid ${colors.mediumGrey};
  border-left: 1px solid ${colors.superDarkGrey};
  border-top: 1px solid ${colors.superDarkGrey};
`;
const UpdateMsg = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
`;

ProfileHeader.Avatar = Avatar;
ProfileHeader.Basic = Basic;
ProfileHeader.Patron = Patron;
ProfileHeader.UpdateDate = UpdateDate;
ProfileHeader.UpdateMsg = UpdateMsg;

type Props = {
  user: any;
};

export default function ProfileHeader(props: Props): JSX.Element {
  const { user } = props;
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const patron = useSelector((state: any) =>
    state.patrons.find((tier: any) =>
      tier.list.find((p: any) => user && user?.id === p.steamid)
        ? { tier: tier.tier, description: tier.description }
        : false,
    ),
  );

  const sendUpdateRequest = (id: any) => {
    setUpdating(true);
    setMessage('Updating... refresh in a few minutes');

    const url = `/rest/users/user/${id}`;
    axios
      .put(url)
      .then((res: any) => {
        if (res.data) {
          setMessage(res.data);
        }
      })
      .catch((err: any) => console.log(err));
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
              {user?.name}
            </a>
          </h1>
          {patron ? (
            <ProfileHeader.Patron
              title={`This user is a tier ${patron.description.toUpperCase()} supporter`}>
              <i className="fas fa-medal" /> {patron.description.toUpperCase()}{' '}
            </ProfileHeader.Patron>
          ) : (
            ''
          )}
        </Flex>
        <ProfileHeader.UpdateDate>
          {
            <span>{`Last updated: ${
              user?.updated === 0
                ? 'never'
                : new Date(user?.updated).toLocaleString()
            }`}</span>
          }
          {Date.now() - user?.updated > 3600000 ? (
            updating ? (
              <ProfileHeader.UpdateMsg>{message}</ProfileHeader.UpdateMsg>
            ) : (
              <button
                className="custom-button"
                onClick={() => sendUpdateRequest(user?.id)}>
                Update
              </button>
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
          <ProfileHeader.Avatar
            src={user?.avatar}
            tier={Number(patron?.tier)}
            alt="avatar"
          />
          <div>Currently there&lsquo;s no info provided about this user.</div>
        </ProfileHeader.Basic>
      </div>
    </Wrapper>
  );
}
