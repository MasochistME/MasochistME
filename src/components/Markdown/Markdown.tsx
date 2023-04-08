import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

import { Flex } from 'components';

type Props = {
	children: string;
	trackClass?: string;
};
export const Markdown = (props: Props) => {
	const { children, trackClass } = props;
	return (
		<StyledMarkdown column>
			<ReactMarkdown
				components={{
					a: ({ node, ...props }) => (
						<a
							className={trackClass ?? 'markdown-link'}
							id={props.children.toString()}
							{...props}
						/>
					),
				}}>
				{children}
			</ReactMarkdown>
		</StyledMarkdown>
	);
};

const StyledMarkdown = styled(Flex)`
	gap: 2.25rem;
	& > * {
		margin: 0;
	}
`;
