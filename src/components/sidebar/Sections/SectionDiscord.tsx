import React from 'react';

export default function SectionDiscord(): JSX.Element {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'none',
				marginBottom: '30px',
			}}>
			<iframe
				src="https://discord.com/widget?id=263045520358899714&theme=dark"
				width="450"
				height="300"
				allowTransparency={true}
				frameBorder="0"
				sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
		</div>
	);
}
