import { RacePlayer } from '@masochistme/sdk/dist/v1/types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useMembers } from 'sdk';
import { Icon, Size, Skeleton } from 'components';
import { ColorTokens, fonts, useTheme } from 'styles';

import { PodiumAvatar } from './PodiumAvatar';
import { usePodiumColor } from './hooks';

type Props = {
	player: RacePlayer;
};
export const PodiumItem = (props: Props) => {
	const { player } = props;
	const { colorTokens } = useTheme();
	const { membersData } = useMembers();

	const podiumColor = usePodiumColor(player?.place as 1 | 2 | 3);

	const member = membersData.find(m => m.discordId === player.discordId);
	const iconSize =
		player.place === 1 ? (Size.BIG / 4) * 3 : (Size.MEDIUM / 4) * 3;

	return (
		<StyledPodiumItem colorTokens={colorTokens}>
			<PodiumItem.Avatar>
				<PodiumItem.Place>
					<Icon
						icon="Bookmark"
						size={iconSize}
						className="place--icon"
						color={podiumColor}
					/>
					<span className="place--number">{player.place}</span>
				</PodiumItem.Place>
				<PodiumItem.Image
					member={member}
					place={player.place as 1 | 2 | 3}
					size={player.place === 1 ? Size.LARGE : (Size.LARGE * 2) / 3}
				/>
			</PodiumItem.Avatar>
			<PodiumItem.Username
				to={`/profile/${member?.steamId}`}
				colorTokens={colorTokens}
				place={player.place as 1 | 2 | 3}>
				{member?.name}
			</PodiumItem.Username>
			<PodiumItem.Score colorTokens={colorTokens}>
				{player.score}
			</PodiumItem.Score>
		</StyledPodiumItem>
	);
};

PodiumItem.Skeleton = () => {
	const { colorTokens } = useTheme();
	return (
		<StyledPodiumItem colorTokens={colorTokens}>
			<Skeleton width={Size.LARGE} height={Size.LARGE} />
		</StyledPodiumItem>
	);
};

const StyledPodiumItem = styled.div<{ colorTokens: ColorTokens }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	box-shadow: 0 0 10px
		${({ colorTokens }) => colorTokens['common-color--shadow']};
	padding: 32px 0;
	background-color: ${({ colorTokens }) => colorTokens['semantic-color--idle']};
	&:nth-child(1) {
		grid-column: 2;
		grid-row: 1;
		height: 100%;
		z-index: 10;
		font-size: 1.2rem;
		& .place--number {
			color: black;
			font-size: 2rem;
			margin-top: -10px;
		}
	}
	&:nth-child(2) {
		grid-column: 1;
		grid-row: 1;
		height: 80%;
		& .place--number {
			color: black;
			font-size: 1.1rem;
			margin-top: -5px;
		}
	}
	&:nth-child(3) {
		grid-column: 3;
		grid-row: 1;
		height: 80%;
		& .place--number {
			color: black;
			font-size: 1.1rem;
			margin-top: -5px;
		}
	}
`;

PodiumItem.Avatar = styled.div`
	position: relative;
`;
PodiumItem.Image = PodiumAvatar;
PodiumItem.Place = styled.div`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	right: -2px;
	top: 1px;
	filter: drop-shadow(-5px 7px 5px #000);
	& .place--number {
		position: absolute;
		font-family: ${fonts.Dosis};
		font-weight: 600;
	}
`;

PodiumItem.Username = styled(Link)<{
	colorTokens: ColorTokens;
	place: 1 | 2 | 3;
}>`
	font-family: ${fonts.Dosis};
	font-size: ${({ place }) => (place === 1 ? '1.5em' : '1.3em')};
	color: ${({ colorTokens }) => colorTokens['core-tertiary-text']};
	letter-spacing: 0.5px;
`;

PodiumItem.Score = styled.span<{ colorTokens: ColorTokens }>`
	font-size: 1.5em;
	font-weight: bold;
	font-family: ${fonts.Dosis};
	border-radius: 32px;
`;
