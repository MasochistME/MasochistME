import React from 'react';

import { Section, SectionProps } from 'containers';

export const DashboardTileDiscord = (
	props: Omit<SectionProps, 'content' | 'title'>,
): JSX.Element => {
	return (
		<Section
			content={
				<iframe
					src="https://discord.com/widget?id=263045520358899714&theme=dark"
					width="350"
					height="450"
					allowTransparency={true}
					frameBorder={0}
					sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
			}
			{...props}
		/>
	);
};
