import React from 'react';
import styled from 'styled-components';

import { Section } from 'containers';

export const SectionFeatured = (): JSX.Element => {
	return (
		<Section
			title="Featured"
			fullWidth
			content={
				<StyledFeaturedVideo>
					<iframe
						width="840"
						height="440"
						src={`https://www.youtube.com/embed/9Lz7VeVDmV4`}
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						title="Featured MasochistME video"
					/>
				</StyledFeaturedVideo>
			}
		/>
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
`;
