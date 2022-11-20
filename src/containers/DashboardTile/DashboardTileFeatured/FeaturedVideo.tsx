import React from 'react';
import styled from 'styled-components';
import { FeaturedVideo as TFeaturedVideo } from '@masochistme/sdk/dist/v1/types';

import { Flex, Markdown } from 'components';
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

	if (!featured.link) return null;
	const ytLinkRegex = new RegExp(/(?<=v=)(.*)/gim);
	const ytLinkId = featured.link.match(ytLinkRegex)?.[0];
	if (!ytLinkId) return null;
	const fixedLink = `https://www.youtube.com/embed/${ytLinkId}`;

	const getMarkdown = () => {
		const title =
			featured.gameTitle ??
			(game
				? `[${game.title}](http://masochist.me/game/${featured.gameId})`
				: '');
		const description = featured.description
			? `- ${featured?.description.replace(
					/\\n/g,
					`
			`,
			  )}`
			: '';
		const memberUsername = member
			? `- by [${member?.name}](http://masochist.me/profile/${featured.memberId})`
			: '';

		return `## ${title} ${description} ${memberUsername}`;
	};

	return (
		<StyledFeaturedVideoWrapper column>
			<Markdown>{getMarkdown()}</Markdown>
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

const StyledFeaturedVideoWrapper = styled(Flex)`
	gap: 8px;
	height: calc(440px+200px);
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
