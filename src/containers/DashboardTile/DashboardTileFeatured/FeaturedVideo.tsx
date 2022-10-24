import React from 'react';
import styled from 'styled-components';
import { FeaturedVideo as TFeaturedVideo } from '@masochistme/sdk/dist/v1/types';

type Props = { featured: TFeaturedVideo };

export const FeaturedVideo = (props: Props) => {
	const { featured } = props;

	if (!featured.link) return null;
	return (
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
	);
};

const StyledFeaturedVideo = styled.div`
	overflow: hidden;
	padding-bottom: 56.25%;
	position: relative;
	height: 0;
	iframe {
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		position: absolute;
	}
`;
