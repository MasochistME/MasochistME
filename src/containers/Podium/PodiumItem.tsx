import { RacePlayer } from '@masochistme/sdk/dist/v1/types';
import { Icon, Size } from 'components';
import { Link } from 'react-router-dom';
import { useMembers } from 'sdk';
import styled from 'styled-components';
import { ColorTokens, fonts, useTheme } from 'styles';
import { PodiumAvatar } from './PodiumAvatar';

type Props = {
	player: RacePlayer & { place: number };
};
export const PodiumItem = (props: Props) => {
	const { player } = props;
	const { colorTokens } = useTheme();
	const { membersData } = useMembers();

	const member = membersData.find(m => m.discordId === player.discordId);
	const iconSize =
		player.place === 1 ? (Size.BIG / 4) * 3 : (Size.MEDIUM / 4) * 2.5;

	return (
		<StyledPodiumItem>
			<PodiumItem.Avatar>
				<PodiumItem.Place>
					<Icon
						icon="Bookmark"
						size={iconSize}
						className="place--icon"
						color={colorTokens['semantic-color--tier-4']}
					/>
					<span className="place--number">{player.place}</span>
				</PodiumItem.Place>
				<PodiumItem.Image
					member={member}
					place={player.place as 1 | 2 | 3}
					size={player.place === 1 ? Size.LARGE : Size.BIG}
				/>
			</PodiumItem.Avatar>
			<PodiumItem.Username
				to={`/profile/${member?.steamId}`}
				colorTokens={colorTokens}>
				{member?.name}
			</PodiumItem.Username>
			<PodiumItem.Score>{player.score}</PodiumItem.Score>
		</StyledPodiumItem>
	);
};

const WIDTH = 128;

const StyledPodiumItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	&:nth-child(1) {
		grid-column: 2;
		grid-row: 1;
		& .place--number {
			color: black;
			font-size: 2rem;
			margin-top: -10px;
		}
	}
	&:nth-child(2) {
		grid-column: 1;
		grid-row: 2;
		margin-top: -${(WIDTH / 4) * 4}px;
		& .place--number {
			color: black;
			font-size: 1.1rem;
			margin-top: -5px;
		}
	}
	&:nth-child(3) {
		grid-column: 3;
		grid-row: 2;
		margin-top: -${(WIDTH / 4) * 4}px;
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
	right: 2px;
	top: 7px;
	filter: drop-shadow(0 0 10px #000);
	& .place--number {
		position: absolute;
		font-family: ${fonts.Dosis};
		font-weight: 600;
	}
`;

PodiumItem.Username = styled(Link)<{ colorTokens: ColorTokens }>`
	font-family: ${fonts.Dosis};
	font-size: 1.5rem;
	color: ${({ colorTokens }) => colorTokens['core-tertiary-text']};
	letter-spacing: 0.5px;
`;

PodiumItem.Score = styled.div``;
