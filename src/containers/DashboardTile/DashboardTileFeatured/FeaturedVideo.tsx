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

	const memberName =
		membersData.find(member => member.steamId === featured.memberId)?.name ??
		'UNKNOWN MEMBER';
	const gameTitle =
		gamesData.find(game => game.id === featured.gameId)?.title ??
		'UNKNOWN GAME';

	if (!featured.link) return null;

	return (
		<StyledFeaturedVideoWrapper column>
			<Markdown>
				{'## [' +
					gameTitle +
					'](http://masochist.me/game/' +
					featured.gameId +
					') - ' +
					(featured?.description ?? '').replace(
						/\\n/g,
						`
			`,
					) +
					' - by [' +
					memberName +
					'](http://masochist.me/profile/' +
					featured.memberId +
					')'}
			</Markdown>
			<StyledFeaturedVideo>
				<iframe
					width="840"
					height="440"
					src={featured.link}
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
