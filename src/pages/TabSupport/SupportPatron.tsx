import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from 'shared/theme';

const WrapperPatron = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 0;
	margin: 10px;
	width: 128px;
`;

const Avatar = styled.img.attrs(({ tier }: { tier: number }) => {
	const style: any = {
		width: '96px',
		height: '96px',
	};
	if (tier === 1) {
		style.border = `4px solid ${colors.tier1}`;
	}
	if (tier === 2) {
		style.border = `4px solid ${colors.tier2}`;
	}
	if (tier === 3) {
		style.border = `5px solid ${colors.tier3}`;
		style.width = '128px';
		style.height = '128px';
	}
	if (tier === 4) {
		style.border = `5px solid ${colors.tier4}`;
		style.width = '128px';
		style.height = '128px';
	}
	return { style };
})<{ tier: number }>`
	margin-bottom: 5px;
	padding: 2px;
	box-sizing: border-box;
	box-shadow: 0 0 10px #000;
	cursor: pointer;
	&:hover {
		padding: 0px;
	}
`;

const Nickname = styled.p`
	font-size: 0.8em;
	text-transform: uppercase;
	letter-spacing: 0.15em;
`;

type TSupportPatron = {
	patron: any;
	tier: any;
};

export default function Patron(props: TSupportPatron): JSX.Element {
	const { patron, tier } = props;
	const history = useHistory();

	const onUserClick = () =>
		patron?.steamid && history.push(`/profile/${patron.steamid}`);

	return (
		<WrapperPatron>
			<Patron.Avatar
				tier={Number(tier)}
				src={patron.avatar}
				onClick={onUserClick}
			/>
			<Patron.Nickname>{patron.name}</Patron.Nickname>
		</WrapperPatron>
	);
}

Patron.Nickname = Nickname;
Patron.Avatar = Avatar;
