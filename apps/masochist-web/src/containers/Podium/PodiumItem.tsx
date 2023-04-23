import { RacePlayer } from '@masochistme/sdk/dist/v1/types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { useMembers } from 'sdk';
import { Icon, Size, Skeleton } from 'components';
import { ColorTokens, useTheme } from 'styles';

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
	gap: var(--size-8);
	box-shadow: 0 0 var(--size-10)
		${({ colorTokens }) => colorTokens['common-color--shadow']};
	padding: var(--size-32) 0;
	background-color: ${({ colorTokens }) => colorTokens['semantic-color--idle']};
	&:nth-child(1) {
		grid-column: 2;
		grid-row: 1;
		height: 100%;
		z-index: 10;
		font-size: var(--font-size-12);
		& .place--number {
			color: black;
			font-size: var(--font-size-32);
			margin-top: -1rem;
		}
	}
	&:nth-child(2) {
		grid-column: 1;
		grid-row: 1;
		height: 80%;
		& .place--number {
			color: black;
			font-size: var(--font-size-18);
			margin-top: -0.5rem;
		}
	}
	&:nth-child(3) {
		grid-column: 3;
		grid-row: 1;
		height: 80%;
		& .place--number {
			color: black;
			font-size: var(--font-size-18);
			margin-top: -0.5rem;
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
	right: -0.2rem;
	top: var(--size-1);
	filter: drop-shadow(-5px 7px 5px #000);
	& .place--number {
		position: absolute;
		font-family: var(--font-dosis);
		font-weight: 600;
	}
`;

PodiumItem.Username = styled(Link)<{
	colorTokens: ColorTokens;
	place: 1 | 2 | 3;
}>`
	font-family: var(--font-dosis);
	font-size: ${({ place }) =>
		place === 1 ? 'var(--font-size-24)' : 'var(--font-size-18)'};
	color: ${({ colorTokens }) => colorTokens['core-tertiary-text']};
	letter-spacing: 0.05rem;
`;

PodiumItem.Score = styled.span<{ colorTokens: ColorTokens }>`
	font-size: var(--font-size-16);
	font-weight: bold;
	font-family: var(--font-dosis);
	border-radius: var(--border-radius-32);
`;
