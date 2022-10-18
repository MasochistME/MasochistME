import React from 'react';

import { Flex } from 'components';

export const SectionDiscord = (): JSX.Element => {
	return (
		<Flex>
			<iframe
				src="https://discord.com/widget?id=263045520358899714&theme=dark"
				width="350"
				height="450"
				allowTransparency={true}
				frameBorder={0}
				sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
		</Flex>
	);
};
