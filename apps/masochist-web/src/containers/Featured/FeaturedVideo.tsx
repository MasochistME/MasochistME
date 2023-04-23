import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { FeaturedVideo as TFeaturedVideo } from '@masochistme/sdk/dist/v1/types';

import { Flex } from 'components';
import { getYTVideoID } from 'utils';
import { useGames, useMembers } from 'sdk';

type Props = {
	featured: TFeaturedVideo;
	isCompact?: boolean;
	hideGame?: boolean;
	hideDescription?: boolean;
	hideOwner?: boolean;
	hideDate?: boolean;
};

export const FeaturedVideo = (props: Props) => {
	const {
		featured,
		isCompact = false,
		hideGame = false,
		hideDescription = false,
		hideOwner = false,
		hideDate = false,
	} = props;
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
			<h3>
				<Flex justifyContent="space-between">
					{!hideOwner && member ? (
						<Link to={`/profile/${member.steamId}`}>{member.name}</Link>
					) : (
						<span />
					)}
					{!hideDate && (
						<p style={{ fontStyle: 'italic' }}>
							{dayjs(featured?.date).format('DD MMMM, YYYY')}
						</p>
					)}
				</Flex>
			</h3>
			<StyledDetails>
				{!hideGame &&
					title &&
					(featured.gameId ? (
						<Link to={`/game/${featured.gameId}`}>{title}</Link>
					) : featured.gameLink ? (
						<a href={featured.gameLink} target="_blank">
							{title}
						</a>
					) : !hideGame ? (
						<span style={{ fontWeight: 600 }}>{title}</span>
					) : null)}
				{!hideDescription && (
					<span style={{ fontStyle: 'italic' }}>
						{featured.description ? `● ${featured.description}` : null}
					</span>
				)}
			</StyledDetails>
			{isCompact && (
				<p style={{ lineHeight: 0, height: 0, opacity: 0 }}>
					This is a very dirty hack to make this work. If I don't put this line
					of text here, the section containing the video won't adjust its height
					to the video. I have no idea how to fix it - it seems to work just
					fine if we include a multiline text just above the video, but not all
					videos have a description. Hence, I am putting this hacky text here.
					If you know how to solve it contact ARCYVILK#6666 on Discord pls
				</p>
			)}
			<StyledFeaturedVideo>
				<iframe
					className="youtube-player"
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

const StyledFeaturedVideoWrapper = styled(Flex)`
	gap: var(--size-8);
	height: auto;
	p,
	h3 {
		margin: 0;
	}
`;

const StyledFeaturedVideo = styled.div`
	position: relative;
	padding-bottom: 56.25%;
	padding-top: var(--size-30);
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

const StyledDetails = styled.div`
	display: inline-block;
	line-height: var(--size-15);
	width: 100%;
	text-align: left;
	& > * {
		margin-right: var(--size-4);
		vertical-align: middle;
	}
`;
