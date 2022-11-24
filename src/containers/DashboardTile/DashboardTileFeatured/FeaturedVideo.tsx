import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FeaturedVideo as TFeaturedVideo } from '@masochistme/sdk/dist/v1/types';

import { Flex } from 'components';
import { useGames, useMembers } from 'sdk';

type Props = { featured: TFeaturedVideo };

export const FeaturedVideo = (props: Props) => {
	const { featured } = props;
	const { membersData } = useMembers();
	const { gamesData } = useGames();

	const game = gamesData.find(game => game.id === featured.gameId);
	const member = membersData.find(
		member => member.discordId === featured.memberId,
	);

	const ytLinkID = getYTVideoID(featured.link);
	if (!ytLinkID) return null;

	const fixedLink = `https://www.youtube.com/embed/${ytLinkID}`;

	const title = featured.gameTitle ?? game?.title ?? null;

	return (
		<StyledFeaturedVideoWrapper column>
			<h2>
				{title &&
					(featured.gameId ? (
						<Link to={`game/${featured.gameId}`}>{title}</Link>
					) : featured.gameLink ? (
						<a href={featured.gameLink} target="_blank">
							{title}
						</a>
					) : (
						title
					))}
				{featured.description ? ` - ${featured.description}` : null}
				{member && (
					<>
						{' '}
						- by <Link to={`profile/${member.steamId}`}>{member.name}</Link>
					</>
				)}
			</h2>
			<StyledFeaturedVideo>
				<iframe
					width="840"
					height="440"
					src={fixedLink}
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					title="Featured MasochistME video"
				/>
			</StyledFeaturedVideo>
		</StyledFeaturedVideoWrapper>
	);
};

const getYTVideoID = (link?: string) => {
	if (!link) return null;
	const ytLinkRegex = [
		new RegExp(/(?<=youtu.be\/)(.*)/gim),
		new RegExp(/(?<=youtube.com\/watch\?v=)(.*)/gim),
	];
	const ytLinkIds = ytLinkRegex
		.map(regex => link.match(regex)?.[0])
		.filter(Boolean);
	return ytLinkIds[0];
};

const StyledFeaturedVideoWrapper = styled(Flex)`
	gap: 8px;
	height: calc(440px+200px);
	h2 {
		margin: 0;
	}
`;

const StyledFeaturedVideo = styled.div`
	position: relative;
	padding-bottom: 56.25%;
	padding-top: 30px;
	height: 0;
	overflow: hidden;
	iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
`;
